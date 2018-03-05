import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ContractService } from '../../services/contract.service';
import { MatDialogRef } from '@angular/material';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';

@Component({
  selector: 'app-points',
  templateUrl: './points.dialog.html',
  styleUrls: ['./points.dialog.css']
})
export class PointsDialog {

  public fg: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PointsDialog>,
    private dialogService: DialogService,
    private contract: ContractService,
    private player: PlayerService,
    private fb: FormBuilder,
  ) {

    this.fg = fb.group({
      damagePoints: [player.points.damage],
      healthPoints: [player.points.health],
      regenerationPoints: [player.points.regeneration]
    });
  }

  get maxPoints(): number {
    let damagePoints = this.damagePoints - this.player.points.damage;
    let healthPoints = this.healthPoints - this.player.points.health;
    let regenerationPoints = this.regenerationPoints - this.player.points.regeneration;

    return this.player.maxPoints - (damagePoints + healthPoints + regenerationPoints);
  }


  get damagePoints():number { return parseInt(this.fg.get('damagePoints').value); }
  get healthPoints():number { return parseInt(this.fg.get('healthPoints').value); }
  get regenerationPoints():number { return parseInt(this.fg.get('regenerationPoints').value); }

  public save() {

    this.contract.setPoints(this.damagePoints, this.healthPoints, this.regenerationPoints).then((tx: Transaction) => {

      // go to the game when transaction is confirmed
      tx.onChange = (tx: Transaction) => {
        if (tx.status === 'confirmed') {
          this.player.load();
        }
      }

      tx.onChange(tx);

    }).catch((err) => {
      this.dialogService.addError(err);
    });

    this.dialogRef.close();

  }

}
