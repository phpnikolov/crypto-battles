import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { DialogService } from '../../services/dialog.service';
import { PointsDialog } from '../../dialogs/points/points.dialog';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.css']
})
export class HeroPage implements OnInit {

  constructor(
    private dialogService: DialogService,
    private player: PlayerService,
  ) { }

  ngOnInit() {
  }

  public showPointsDialog() {
    this.dialogService.dialog.open(PointsDialog, { width: '350px' });
  }

  public getItemTooltip(item: Item): string {
    return item.type + 
      (item.damage> 0 ? "\nDamage: " + item.damage : "") + 
      (item.health> 0 ? "\nHealth: " + item.health : "") + 
      (item.regeneration> 0 ? "\nRegeneration: " + item.regeneration : "");
  }

}
