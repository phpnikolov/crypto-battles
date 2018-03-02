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

  private readonly countValuelist: { [value: number]: string } = {
    0: 'Unknown',
    1: 'Few',
    2: 'Several',
    3: 'Pack',
    4: 'Lots',
    5: 'Horde',
  }


  private _creatures: { data: Creature, count: string | undefined }[] = [];

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
        this._creatures = [];
        for (let i = 0; i < 6; i++) {
          const cType = creaturesData['_cType' + i];
          const cCount = creaturesData['_cCount' + i];


          if (cType == 0) {
            // this creature is dead
            this._creatures.push(undefined);
            continue;
          }

          this._creatures.push({
            data: this.creaturesValuelist[cType],
            count: this.countValuelist[cCount]
          });
        }
      })
      .catch(err => {
        this.dialogService.addError(err);
      })
  }

  get creatures() {
    return this._creatures;
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