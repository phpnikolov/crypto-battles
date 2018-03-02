import { Component, OnInit } from '@angular/core';
import { CreaturesService } from '../../services/creatures.service';
import { ContractService } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';

@Component({
  selector: 'app-creatures',
  templateUrl: './creatures.page.html',
  styleUrls: ['./creatures.page.css']
})
export class CreaturesPage implements OnInit {

  constructor(
    private dialogService: DialogService,
    private contract: ContractService,
    public creaturesService: CreaturesService
  ) { }

  ngOnInit() {
    this.creaturesService.load();
    setInterval(() => {
      this.creaturesService.load();
    }, 7500);
  }

  public attack(creatureIdx: number) {
    this.contract.attackCreature(creatureIdx)
      .then((tx:Transaction) => {
        tx.onChange = (tx:Transaction) => {

        }
      })
      .catch(err => {
        this.dialogService.addError(err);
      });
  }

}
