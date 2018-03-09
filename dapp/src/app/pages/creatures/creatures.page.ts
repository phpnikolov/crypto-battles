import { Component, OnInit } from '@angular/core';
import { CreaturesService } from '../../services/creatures.service';
import { ContractService } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-creatures',
  templateUrl: './creatures.page.html',
  styleUrls: ['./creatures.page.css']
})
export class CreaturesPage implements OnInit {

  public battlesInProgress: { [cretureIdx: number]: boolean } = {};

  public readonly cCountList: { [value: string]: any } = {
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
    5: {
      label: 'Horde',
      min: 50,
      max: 99
    },
  }

  constructor(
    private dialogService: DialogService,
    private contract: ContractService,
    public player: PlayerService,
    public creaturesService: CreaturesService
  ) { }

  ngOnInit() {
    this.creaturesService.load();
    setInterval(() => {
      this.creaturesService.load();
    }, 7500);
  }

  public attack(creatureIdx: number) {
    this.battlesInProgress[creatureIdx] = true;
    setTimeout(() => {
      this.battlesInProgress[creatureIdx] = false;
    }, 60000);
    this.contract.fight(creatureIdx)
      .then((tx: Transaction) => {
        tx.onChange = (tx: Transaction) => {
          if (tx.status === 'confirmed') {
            this.player.loadPlayer();
            this.creaturesService.load();
          }
        }

        tx.onChange(tx);
      })
      .catch(err => {
        this.dialogService.addError(err);
        this.battlesInProgress[creatureIdx] = false;
      });
  }

  get creatures() {
    return this.creaturesService.creatures;
  }


  get battles() {
    return this.creaturesService.battles;
  }

  get pastBattles() {
    return this.creaturesService.pastBattles;
  }


}
