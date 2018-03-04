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
    this.contract.attackCreature(creatureIdx)
      .then((tx: Transaction) => {
        tx.onChange = (tx: Transaction) => {
          if (tx.status === 'confirmed') {
            this.player.load();
            this.creaturesService.load();
            this.battlesInProgress[creatureIdx] = false;
          }
          if (tx.status === 'error') {
            this.battlesInProgress[creatureIdx] = false;
          }
        }

        tx.onChange(tx);
      })
      .catch(err => {
        this.battlesInProgress[creatureIdx] = false;
        this.dialogService.addError(err);
      });
  }

}
