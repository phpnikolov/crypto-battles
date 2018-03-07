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
      damage: 3,
      health: 5,
      gold: 16, 
      experience: 40 
    },
    2: {
      name: "Rogue",
      damage: 7,
      health: 5,
      gold: 36, 
      experience: 40 
    },
    3: {
      name: "Pikeman",
      damage: 7,
      health: 9,
      gold: 32, 
      experience: 60 
    },
    4: {
      name: "Nomad",
      damage: 8,
      health: 16,
      gold: 32, 
      experience: 180 
    },
    5: {
      name: "Swordman",
      damage: 15,
      health: 21,
      gold: 72, 
      experience: 180 
    },
    6: {
      name: "Nomad",
      damage: 20,
      health: 40,
      gold: 80, 
      experience: 450 
    }
  };

  private _battles: { cType: number, cCount: number }[] = [];
  private _pastBattles: { round: number, cType: number, units: number | undefined }[] = [];

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
      //return;
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
            units: params[2]
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