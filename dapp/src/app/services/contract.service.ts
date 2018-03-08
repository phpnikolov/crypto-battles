import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';

import * as Eth from 'web3-eth';
import * as Utils from 'web3-utils';
import * as Tx from "ethereumjs-tx";


import { environment } from "../../environments/environment";
import { Transaction } from '../interfaces/transaction';

@Injectable()
export class ContractService {

  private readonly env = environment;
  private eth;
  private contract;
  constructor(public wallet: WalletService) {

    this.eth = new Eth;
    this.eth.setProvider(this.env.provider);
    this.contract = new this.eth.Contract(this.env.contract.abi, this.env.contract.address);
  }


  public isRegistered() {
    return this.contract.methods.isRegistered(this.wallet.getAddress()).call({ from: this.wallet.getAddress() });
  }

  public register(username: string): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      let hexUsename = Utils.stringToHex(username.toLowerCase());
      let method = this.contract.methods.register(hexUsename);

      method.estimateGas({ from: this.wallet.getAddress() })
        .then((gasAmount: number) => {
          let tx: Transaction = {
            label: 'Registration',
            to: this.env.contract.address,
            gasLimit: Math.ceil(gasAmount * 1.5), // 50% more gas than expected
            data: method.encodeABI()
          };

          this.wallet.sendTransaction(tx).then(resolve).catch(reject);

        })
        .catch(reject);
    });
  }


  public getPlayer(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.players(this.wallet.getAddress()).call()
        .then(resolve).catch(reject);
    });
  }

  public getInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getInfo().call({ from: this.wallet.getAddress() })
        .then(resolve).catch(reject);
    });
  }

  public getBattles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getBattles().call({ from: this.wallet.getAddress() })
        .then(resolve).catch(reject);
    });
  }

  public getPastBattles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getPastBattles().call({ from: this.wallet.getAddress() })
        .then(resolve).catch(reject);
    });
  }

  public fight(battleId: number): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      let method = this.contract.methods.fight(battleId);

      method.estimateGas({ from: this.wallet.getAddress() })
        .then((gasAmount: number) => {
          let tx: Transaction = {
            label: 'Attack creature #' + (battleId + 1),
            to: this.env.contract.address,
            gasLimit: Math.ceil(gasAmount * 1.5),
            data: method.encodeABI()
          };

          this.wallet.sendTransaction(tx).then(resolve).catch(reject);

        })
        .catch(reject);
    });
  }


  public setPoints(damage: number, health: number, spirit: number): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      let method = this.contract.methods.setPoints(damage, health, spirit);

      let tx: Transaction = {
        label: 'Set points',
        to: this.env.contract.address,
        gasLimit: 70000,
        data: method.encodeABI()
      };

      this.wallet.sendTransaction(tx).then(resolve).catch(reject);
    });
  }

  public shop(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.shop().call({ from: this.wallet.getAddress() })
        .then(resolve).catch(reject);
    });
  }

  public buyItem(itemId: number, round: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let method = this.contract.methods.buyItem(itemId, round);
          let tx: Transaction = {
            label: 'Buy item #' + (itemId + 1),
            to: this.env.contract.address,
            gasLimit: 150000,
            data: method.encodeABI()
          };

          this.wallet.sendTransaction(tx).then(resolve).catch(reject);
    });
  }

  public sellItem(slotId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let method = this.contract.methods.sellItem(slotId);
          let tx: Transaction = {
            label: 'Sell item #' + (slotId + 1),
            to: this.env.contract.address,
            gasLimit: 150000,
            data: method.encodeABI()
          };

          this.wallet.sendTransaction(tx).then(resolve).catch(reject);
    });
  }

  public getItems(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getItems().call({ from: this.wallet.getAddress() })
        .then(resolve).catch(reject);
    });
  }
}
