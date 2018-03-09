import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { keystore } from "eth-lightwallet";

import * as Eth from 'web3-eth';
import * as Utils from 'web3-utils';
import * as EthereumTx from "ethereumjs-tx";

import * as _ from "lodash";

import { environment } from "../../environments/environment";
import { PromptDialog } from "../dialogs/prompt/prompt.dialog";
import { MatDialog } from '@angular/material';
import { DialogService } from './dialog.service';
import { Transaction } from '../interfaces/transaction';
import { Buffer } from 'buffer';

import { NotEnoughBalanceDialog } from '../dialogs/not-enough-balance/not-enough-balance.dialog';

import { BigInteger } from 'big-integer';
import * as bigInt from 'big-integer';
import { Router } from '@angular/router';



@Injectable()
export class WalletService {

  private _isUnlocked: boolean = false;
  public readonly env = environment;

  public eth;
  public ks;
  private password;
  private transactions: Transaction[] = [];
  public gasPrice: BigInteger = bigInt(Utils.toWei(this.env.gasPrice, 'Gwei'));

  constructor(
    private router: Router,
    private storage: StorageService,
    public dialogService: DialogService

  ) {
    this.eth = new Eth;
    this.eth.setProvider(this.env.provider);
    this.loadKs();

    // monitor pending txs
    let pendingTxs: Transaction[] = this.getPendingTransactions();
    pendingTxs.forEach((tx: Transaction) => {
      this.monitorTransaction(tx);
    });
  }

  private monitorTransaction(tx: Transaction) {
    this.eth.getTransactionReceipt(tx.txHash)
      .then((receipt) => {
        if (receipt && receipt.blockNumber) {
          tx.status = 'confirmed';
          tx.gasLimit = receipt.gasUsed;
          this.storeTransactions();
        }
        else {
          // retry after 2 sec
          setTimeout(() => {
            this.monitorTransaction(tx);
          }, 2000);
        }
      })
      .catch(console.error);
  }

  private loadKs() {
    let keystoreSerialized = this.storage.getVal('keystore');
    try {
      this.ks = keystore.deserialize(keystoreSerialized);
    }
    catch (ex) {

    }
    this.loadTransactions();
  }

  public saveKs(seedPhrase: string, password: string): Promise<void> {
    // save password until page refresh
    this.password = password;

    return new Promise((resolve, reject) => {
      keystore.createVault({
        password: password,
        seedPhrase: seedPhrase,
        hdPathString: "m/44'/60'/0'/0"
      }, (err, ks) => {
        if (err) {
          return reject(err);
        }
        ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) {
            return reject(err);
          }

          ks.generateNewAddress(pwDerivedKey, 1);

          this.ks = ks;
          this._isUnlocked = true;
          this.storage.setVal('keystore', ks.serialize());
          this.loadTransactions();

          return resolve();
        });
      });
    })
  }

  get isUnlocked() { return this._isUnlocked; }
  public unlock(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this._isUnlocked) {
        resolve();
        return;
      }
      this.getPrivateKey().then(() => {
        this._isUnlocked = true;
        resolve();
      }, reject);

    });
  }

  public getAddress(): string | undefined {
    return this.address;
  }

  get address(): string | undefined {
    if (this.ks) {
      let addresses: string[] = this.ks.getAddresses();
      if (addresses.length > 0) {
        return addresses[0];
      }
    }
  }

  /** 
   * Prompt user to enter password
  */
  public getUserPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof this.password !== 'undefined') {
        return resolve(this.password);
      }

      this.dialogService.prompt('Enter your password to unlock', { inputType: 'password' }).then((password: string) => {
        this.password = password;
        resolve(this.password);
      }).catch(() => {
        this.router.navigate(['/login']);
      });
    });
  }

  public getTransactions(): Transaction[] {
    return _.orderBy(this.transactions, ['timeCreated'], ['desc']);
  }

  public getPendingTransactions(): Transaction[] {
    return _.filter(this.getTransactions(), ['status', 'pending']);
  }

  public getTransaction(txHash: string): Transaction {
    return _.find(this.transactions, ['txHash', txHash]);
  }

  public getPasswordDerivedKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getUserPassword().then((password: string) => {


        this.ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) {
            return reject(err);
          }

          if (this.ks.isDerivedKeyCorrect(pwDerivedKey)) {
            resolve(pwDerivedKey);
          }
          else {
            // wrong password, try again
            this.password = undefined;
            this.dialogService.clearAlerts();
            this.dialogService.addError('Wrong password');
            this.getPasswordDerivedKey().then(resolve).catch(reject);
          }
        });
      }).catch(reject);
    });
  }


  /** 
   * Unlock private key with the user password
  */
  public getPrivateKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.ks) {
        return reject();
      }

      this.getPasswordDerivedKey().then((pwDerivedKey) => {
        let privateKey = this.ks.exportPrivateKey(this.address, pwDerivedKey);
        resolve(privateKey);
      }).catch(reject);
    });
  }

  public getBalance(): Promise<string> {
    return this.eth.getBalance(this.address);
  }

  private storeTransactions(): void {
    if (!this.address) {
      return;
    }

    this.storage.setVal(this.address + '-txs', JSON.stringify(this.getTransactions().slice(0, 20)));
  }

  private loadTransactions() {
    if (!this.address) {
      return;
    }

    this.transactions = [];
    let txsJson = this.storage.getVal(this.address + '-txs');

    if (txsJson) {
      try {
        this.transactions = JSON.parse(txsJson);
      }
      catch (ex) {
      }
    }
  }


  public sendTransaction(tx: Transaction): Promise<Transaction> {
    return new Promise<Transaction>(async (resolve, reject) => {
      if (this.getPendingTransactions().length > 0) {
        reject("Please wait until previous transaction is over.");
        return;
      }

      let txAmount: BigInteger = bigInt(tx.value).plus(this.gasPrice.times(tx.gasLimit));

      let balance = await this.getBalance();
      if (txAmount.greater(balance)) {
        let dialogService = this.dialogService;

        let mtDialog = this.dialogService.dialog.open(NotEnoughBalanceDialog, { width: '375px', data: { address: this.address }, disableClose: true });

        let timer = setInterval(async () => {
          let balance = await this.getBalance();
          if (txAmount.lesser(balance)) {
            // call `sendTransaction` after the address have enough balance
            this.sendTransaction(tx).then(resolve).catch(reject);
            mtDialog.close();
            clearInterval(timer);
            return;
          }

          dialogService.addMessage('Waiting...', 4500);
        }, 5000);

        return;
      }

      if (typeof tx.onChange !== 'function') {
        tx.onChange = (tx) => { }
      }

      tx.timeCreated = new Date().getTime();
      tx.status = 'pending';
      tx.gasPrice = this.gasPrice.toString(10);

      let ethereumTx = new EthereumTx({
        nonce: await this.eth.getTransactionCount(this.address),
        gasLimit: tx.gasLimit,
        gasPrice: '0x' + this.gasPrice.toString(16),
        to: tx.to,
        value: tx.value,
        data: tx.data
      });



      this.getPrivateKey().then((privateKey: string) => {
        let bPrivateKey = new Buffer(privateKey, 'hex');
        ethereumTx.sign(bPrivateKey);

        let serializedTx = ethereumTx.serialize();

        this.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .once('transactionHash', (txHash: string) => {
            // transaction accepted
            tx.txHash = txHash;
            this.transactions.push(tx);
            this.storeTransactions();
            resolve(tx);
            tx.onChange(tx);
          })
          .on('error', (error: Error) => {
            // transaction rejected
            if (error.message.indexOf('within 50 blocks') > -1) {
              // web3js stops watching transaction after 50 seconds and throw this error
              // Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!
              this.monitorTransaction(tx);
            }
            else {
              tx.status = 'error';
              this.storeTransactions();
              reject(error);
              tx.onChange(tx);
            }
          })
          .then((receipt) => {
            tx.status = 'confirmed';
            tx.gasLimit = receipt.gasUsed;
            this.storeTransactions();
            tx.onChange(tx);
          });
      });


    });
  }
}


