import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';

import * as Eth from 'web3-eth';
import * as Utils from 'web3-utils';
import * as Tx from "ethereumjs-tx";


import { environment } from "../../environments/environment";

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
    return this.contract.methods.isRegistered(this.wallet.getAddress()).call();
  }

  public register(username: string): Promise<void> {
    let hexUsename = Utils.stringToHex(username.toLowerCase());

    var register = this.contract.methods.register(hexUsename);

    return this.wallet.sendTransaction(this.env.contract.address, 300000, 0, register.encodeABI());
  }

  public getPlayer(addr: string): Promise<Player> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getPlayer(this.wallet.getAddress()).call()
        .then(data => {
          let player:Player = {
            username: Utils.hexToString(data['_username']),
            blocks: parseInt(data['_blocks']),
            gold: parseInt(data['_gold']),
            experience: parseInt(data['_experience']),
            peasants: parseInt(data['_peasants']),
            peasantsToBuy: parseInt(data['_peasantsToBuy']),
            miners: parseInt(data['_miners']),
            soldiers: parseInt(data['_soldiers']),
            castleLvl: parseInt(data['_castleLvl']),
            houses: parseInt(data['_houses'])
          }

          resolve(player);
        })
    });
  }

}

export interface Player {
  username: string,
  blocks: number,
  gold: number,
  experience: number,
  peasants: number,
  peasantsToBuy: number,
  miners: number,
  soldiers: number,
  castleLvl: number,
  houses: number
}