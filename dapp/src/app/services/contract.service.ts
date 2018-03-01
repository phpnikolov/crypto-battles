import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';

import * as Eth from 'web3-eth';
import * as Utils from 'web3-utils';
import * as Tx from "ethereumjs-tx";


import { environment } from "../../environments/environment";
import { Transaction } from '../interfaces/transaction';
import { Player } from '../classes/player';

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
    return this.contract.methods.isRegistered(this.wallet.getAddress()).call({from: this.wallet.getAddress()});
  }

  public register(username: string): Promise<Transaction> {
    let hexUsename = Utils.stringToHex(username.toLowerCase());
    let method = this.contract.methods.register(hexUsename);

    let tx: Transaction = {
      label: 'User registration',
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }


  public getPlayer(): Promise<Player> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getPlayer().call({from: this.wallet.getAddress()})
        .then(data => {
          let player: Player = new Player(data);


          resolve(player);
        }).catch(reject);
    });
  }
}
