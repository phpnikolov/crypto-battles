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


@Injectable()
export class WalletService {

  private _isUnlocked: boolean = false;
  public readonly env = environment;

  public eth;
  private ks;
  private password;
  private transactions: Transaction[] = [];

  constructor(
    private storage: StorageService,
    public dialogService: DialogService

  ) {
    this.eth = new Eth;
    this.eth.setProvider(this.env.provider);
    this.loadKs();
  }

  private loadKs() {
    let keystoreSerialized = this.storage.getVal('keystore');
    try {
      this.ks = keystore.deserialize(keystoreSerialized);
    }
    catch (ex) {

    }
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
  private getUserPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof this.password !== 'undefined') {
        return resolve(this.password);
      }

      this.dialogService.prompt('Enter password', { inputType: 'password', disableClose: true }).then((password: string) => {
        this.password = password;
        resolve(this.password);
      }).catch(reject);
    });
  }

  public getTransactions(): Transaction[] {
    return _.orderBy(this.transactions, ['timeCreated'], ['desc']);
  }

  public getTransaction(txHash: string): Transaction {
    return _.find(this.transactions, ['txHash', txHash]);
  }

  /** 
   * Unlock private key with the user password
  */
  public getPrivateKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.ks) {
        return reject();
      }

      this.getUserPassword().then((password: string) => {


        this.ks.keyFromPassword(password, (err, pwDerivedKey) => {
          if (err) {
            return reject(err);
          }

          try {
            let privateKey = this.ks.exportPrivateKey(this.getAddress(), pwDerivedKey);

            // private key is unlocked
            return resolve(privateKey);
          }
          catch (ex) {
            // wrong password, try again
            this.password = undefined;
            this.dialogService.clearAlerts();
            this.dialogService.addError('Wrong password');
            this.getPrivateKey().then(resolve).catch(reject);
          }
        });
      }).catch(reject);
    });
  }

  public getBalance(): Promise<string> {
    return this.eth.getBalance(this.getAddress());
  }

  public sendTransaction(tx: Transaction): Promise<Transaction> {

    return new Promise<Transaction>(async (resolve, reject) => {
      let ethereumTx = new EthereumTx({
        nonce: await this.eth.getTransactionCount(this.getAddress()),
        gasLimit: tx.gasLimit,
        gasPrice: tx.gasPrice,
        to: tx.to,
        value: tx.value,
        data: tx.data
      });

      /**
       * @todo if gas * gasPrice > balance, display message to fund the account
       */

      if (typeof tx.onChange !== 'function') {
        tx.onChange = (tx) => { }
      }
      tx.timeCreated = new Date().getTime();
      tx.status = 'pending';

      this.getPrivateKey().then((privateKey: string) => {
        let bPrivateKey = new Buffer(privateKey, 'hex');
        ethereumTx.sign(bPrivateKey);

        let serializedTx = ethereumTx.serialize();

        this.transactions.push(tx);

        this.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .once('transactionHash', (txHash: string) => {
            // transaction accepted
            tx.txHash = txHash;

            resolve(tx);
            tx.onChange(tx);
          })
          .on('error', (error) => {
            // transaction rejected
            tx.status = 'error';
            console.error(error);
            reject(error);
            tx.onChange(tx);
          })
          .then((receipt) => {
            console.log(receipt);
            tx.status = 'confirmed';
            tx.onChange(tx);
          });
      });


    });
  }
}


