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
    return this.contract.methods.isRegistered(this.wallet.getAddress()).call();
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


  public buyMiners(miners: number): Promise<Transaction> {
    let method = this.contract.methods.buyMiners(miners);

    let tx: Transaction = {
      label: `Buy ${miners} miner(s)`,
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }

  public buyPeasants(peasants: number): Promise<Transaction> {
    let method = this.contract.methods.buyPeasants(peasants);

    let tx: Transaction = {
      label: `Buy ${peasants} peasant(s)`,
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }

  public buySolders(solders: number): Promise<Transaction> {
    let method = this.contract.methods.buySolders(solders);

    let tx: Transaction = {
      label: `Buy ${solders} solder(s)`,
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }

  public buyHouses(houses: number): Promise<Transaction> {
    let method = this.contract.methods.buyHouses(houses);

    let tx: Transaction = {
      label: `Buy ${houses} house(s)`,
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }

  public upgradeCastle(): Promise<Transaction> {
    let method = this.contract.methods.upgradeCastle();

    let tx: Transaction = {
      label: `Upgrade castle`,
      to: this.env.contract.address,
      gasLimit: 300000,
      data: method.encodeABI()
    }

    return this.wallet.sendTransaction(tx);
  }

  public getPlayer(addr: string): Promise<Player> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getPlayer(addr).call()
        .then(data => {
          let player: Player = {
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
        }).catch(reject);
    });
  }

  public getPrices(addr: string): Promise<Prices> {
    return new Promise((resolve, reject) => {
      this.contract.methods.getPlayer(addr).call()
        .then(data => {
          let prices: Prices = {
            miner: parseInt(data['_miner']),
            solder: parseInt(data['_solder']),
            house: parseInt(data['_house']),
            peasant: parseInt(data['_peasant']),
            castle: parseInt(data['_castle']),
          }

          resolve(prices);
        }).catch(reject);
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

export interface Prices {
  miner: number,
  solder: number,
  house: number,
  peasant: number,
  castle: number
}