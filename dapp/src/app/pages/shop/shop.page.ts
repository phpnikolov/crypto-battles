import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Item } from '../../interfaces/item';
import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { ItemService } from '../../services/item.service';
import { Transaction } from '../../interfaces/transaction';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.css']
})
export class ShopPage {


  public purchasesInProgress: boolean[] = [];
  private _items: Item[] = [];

  public constructor(
    private wallet: WalletService,
    private contract: ContractService,
    private dialogService: DialogService,
    private itemService: ItemService,
    public player: PlayerService
  ) {

    this.load();

    setTimeout(() => {
      this.load();
    }, 10 * 1000);
  }

  get isLoaded(): boolean {
    return (this.items.length > 0);
  }

  public load() {
    if (!this.wallet.isUnlocked) {
      //return;
    }


    this.contract.shop()
      .then((data) => {
        for (let i = 0; i < data.length; i++) {

          this._items[i] = this.itemService.unzipItem(data[i]);
        }
      })
      .catch(err => {
        this.dialogService.addError("Can't connect to Provider");
      });
  }

  public buyItem(itemId: number): void {
    this.purchasesInProgress[itemId] = true;
    this.contract.buyItem(itemId, this.player.round)
      .then((tx: Transaction) => {
        tx.onChange = (tx: Transaction) => {
          if (tx.status === 'confirmed') {
            this.player.loadPlayer();
            this.player.loadItems();
            this.load();
            this.purchasesInProgress[itemId] = false;
          }
          if (tx.status === 'error') {
            this.purchasesInProgress[itemId] = false;
          }
        }

      })
      .catch((err) => {
        this.purchasesInProgress[itemId] = false;
        this.dialogService.addError(err);
      });
  }


  get items() {
    return this._items;
  }



}
