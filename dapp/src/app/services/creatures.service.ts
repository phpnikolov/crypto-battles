import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';
import { ContractService } from './contract.service';
import { DialogService } from './dialog.service';

@Injectable()
export class CreaturesService {


  private readonly creaturesValuelist: { [cType: number]: Creature } = {
    1: {
      name: 'Halfling',
      imageUrl: './assets/images/creatures/halfling.png',
      damage: 3,
      health: 5,
      gold: 16,
      experience: 40
    },
    2: {
      name: 'Rogue',
      imageUrl: './assets/images/creatures/rogue.png',
      damage: 7,
      health: 5,
      gold: 36,
      experience: 40
    },
    3: {
      name: 'Nomad',
      imageUrl: './assets/images/creatures/nomad.png',
      damage: 8,
      health: 16,
      gold: 32,
      experience: 180
    }
  };

  private readonly countValuelist: { [value: number]: any } = {
    0: {
      label: 'Unknown',
      min: 0,
      max: 9999
    },
    1: {
      label: 'Few',
      min: 1,
      max: 4
    },
    2: {
      label: 'Several',
      min: 5,
      max: 9
    },
    3: {
      label: 'Pack',
      min: 10,
      max: 19
    },
    4: {
      label: 'Lots',
      min: 20,
      max: 49
    },
    5:  {
      label: 'Horde',
      min: 50,
      max: 99
    },
  }


  private _creatures: { data: Creature, count: string }[] = [];
  private _battles: { data: Creature, units: number | undefined}[] = [];

  public constructor(
    private wallet: WalletService,
    private contract: ContractService,
    private dialogService: DialogService
  ) {

  }

  get isLoaded(): boolean {
    return (this._creatures.length > 0);
  }

  public load() {
    if (!this.wallet.isUnlocked) {
      //return;
    }

    this.contract.getCreatures()
      .then((creaturesData) => {
        for (let i = 0; i < 5; i++) {
          const cType = creaturesData['_cType' + i];
          const cCount = creaturesData['_cCount' + i];

          this._creatures[i] = {
            data: this.creaturesValuelist[cType],
            count: this.countValuelist[cCount]
          };
        }
      })
      .catch(err => {
        this.dialogService.addError(err);
      });

      this.contract.getBattles()
      .then((creaturesData) => {
        for (let i = 0; i < 5; i++) {
          const cType = creaturesData['_cType' + i];

          if (cType == 0){
            // there is no battle today
            this._battles[i] = undefined;
            continue;
          }

          this._battles[i] = {
            data: this.creaturesValuelist[cType],
            units: creaturesData['_uinits' + i]
          };
        }
      })
      .catch(err => {
        this.dialogService.addError(err);
      });
  }

  get creatures() {
    return this._creatures;
  }

  get battles() {
    return this._battles;
  }

}



export interface Creature {
  name: string,
  imageUrl: string,
  damage: number,
  health: number,
  gold: number,
  experience: number
}