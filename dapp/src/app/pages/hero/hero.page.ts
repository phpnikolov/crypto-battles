import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { DialogService } from '../../services/dialog.service';
import { PointsDialog } from '../../dialogs/points/points.dialog';
import { Item } from '../../interfaces/item';
import { ContractService } from '../../services/contract.service';
import { Transaction } from '../../interfaces/transaction';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.css']
})
export class HeroPage implements OnInit {

  constructor(
    private dialogService: DialogService,
    public player: PlayerService,
    private contract: ContractService
  ) { }

  ngOnInit() {
  }

  public showPointsDialog() {
    this.dialogService.dialog.open(PointsDialog, { width: '350px' });
  }

  public getItemTooltip(item: Item): string {
    return item.type +
      (item.damage > 0 ? "\nDamage: " + item.damage : "") +
      (item.health > 0 ? "\nHealth: " + item.health : "") +
      (item.regeneration > 0 ? "\nRegeneration: " + item.regeneration : "") +
      "\n\n(click for sell)";
  }


  public getItemPrice(item: Item): number {
    let cumulativeStats = item.damage + Math.floor(item.health / 5) + (item.regeneration * 10);
    return Math.floor(50 * cumulativeStats + (Math.floor(cumulativeStats / 2) * cumulativeStats));
  }

  public getItemSellPrice(item: Item): number {
    return Math.floor(this.getItemPrice(item) / 2);
  }

  public sellItem(slotId: number) {
    let price = this.getItemSellPrice(this.player.items[slotId]);
    this.dialogService.confirm(`Are you sure you want to sell item #${slotId + 1} for ${price} gold?`)
      .then(() => {
        this.contract.sellItem(slotId)
          .then((tx: Transaction) => {
            tx.onChange = (tx: Transaction) => {
              if (tx.status === 'confirmed') {
                this.player.loadPlayer();
                this.player.loadItems();
              }
            }

            tx.onChange(tx);

          })
          .catch(err => {
            this.dialogService.addError(err);
          })
      })
      .catch(() => {
        
      });

  }

}
