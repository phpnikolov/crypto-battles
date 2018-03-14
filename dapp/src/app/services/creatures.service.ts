import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';
import { ContractService } from './contract.service';
import { DialogService } from './dialog.service';
import { Creature } from '../interfaces/creature';
import { forEach } from '@angular/router/src/utils/collection';
import { ZipperService } from './zipper.service';

@Injectable()
export class CreaturesService {


  private creaturesCount = 7;
  public creatures: { [cType: number]: Creature } = {
    1: {
      name: "Halfling",
      damage: 2,
      health: 11,
      gold: 20,
      experience: 55
    },
    2: {
      name: "Rogue",
      damage: 4,
      health: 11,
      gold: 40,
      experience: 55
    },
    3: {
      name: "Pikeman",
      damage: 4,
      health: 23,
      gold: 40,
      experience: 115
    },
    4: {
      name: "Nomad",
      damage: 5,
      health: 38,
      gold: 50,
      experience: 190
    },
    5: {
      name: "Swordman",
      damage: 12,
      health: 33,
      gold: 120,
      experience: 165
    },
    6: {
      name: "Cavalier",
      damage: 10,
      health: 77,
      gold: 100,
      experience: 385
    }
  };

  private _battles: { cType: number, cCount: number }[] = [];
  private _pastBattles: { round: number, cType: number, units: number, isVictory: boolean }[] = [];

  public constructor(
    private wallet: WalletService,
    private contract: ContractService,
    private dialogService: DialogService,
    private zipper: ZipperService
  ) {

  }

  get isLoaded(): boolean {
    return (this.battles.length > 0 && this.pastBattles.length > 0);
  }

  public load() {
    if (!this.wallet.isUnlocked) {
      return;
    }

    this.contract.getBattles()
      .then((battles) => {
        for (let i = 0; i < 6; i++) {
          this._battles[i] = {
            cType: parseInt(battles['_cType' + i]),
            cCount: battles['_cCount' + i]
          };
        }
      })
      .catch(err => {
        this.dialogService.addError("Can't connect to Provider");
      });

    this.contract.getPastBattles()
      .then((data) => {

        for (let i = 0; i < data.length; i++) {
          const zipCode = data[i];

          let params: number[] = this.zipper.unzipUint24(zipCode);
          this._pastBattles[i] = {
            round: params[0],
            cType: params[1],
            units: params[2],
            isVictory: !!params[3],
          };


        }
      })
      .catch(err => {
        this.dialogService.addError("Can't connect to Provider");
      });
  }


  get battles() {
    return this._battles;
  }

  get pastBattles() {
    return this._pastBattles;
  }

}