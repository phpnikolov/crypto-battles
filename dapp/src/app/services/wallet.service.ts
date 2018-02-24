import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { keystore } from "eth-lightwallet";

import * as Eth from 'web3-eth';
import * as Utils from 'web3-utils';
import * as Tx from "ethereumjs-tx";

import { environment } from "../../environments/environment";
import { PromptDialog } from "../dialogs/prompt/prompt.dialog";
import { MatDialog } from '@angular/material';
import { DialogService } from './dialog.service';



@Injectable()
export class WalletService {

  public readonly env = environment;

  public eth;
  private ks;
  private password;
  private pendingTransactions:string[] = [];

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

          this.storage.setVal('keystore', ks.serialize());
          this.loadKs();

          return resolve();
        });
      });
    })
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

      this.dialogService.prompt('Enter password', { inputType: 'password' }).then((password: string) => {
        this.password = password;
        resolve(this.password);
      }).catch(reject);
    });
  }

  public getPendingTransactions() :string[] {
    return this.pendingTransactions;
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

  public sendTransaction(to: string, gas: number, value: number = 0, data: string = ''): Promise<void> {

    return new Promise<void>(async (resolve, reject) => {
      let tx = new Tx({
        nonce: await this.eth.getTransactionCount(this.getAddress()),
        gas: gas,
        to: to,
        value: value,
        data: data
      });

      /**
       * @todo if gas * gasPrice > balance, display message to fund the account
       */

      this.getPrivateKey().then((privateKey: string) => {
        let bPrivateKey = new Buffer(privateKey, 'hex');
        tx.sign(bPrivateKey);

        let serializedTx = tx.serialize();

        this.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
          .once('transactionHash', (txHash:string) => {
            // transaction accepted
            this.pendingTransactions.push(txHash);
          })
          .on('error', (error) => {
            // transaction rejected
            reject(error);
          })
          .then((receipt) => {
            // minned
            resolve();
            let idx = this.pendingTransactions.indexOf(receipt.transactionHash);
            if (idx > -1) {
              this.pendingTransactions.splice(idx, 1);
            }
          });
      });

      
    });
  }
}
