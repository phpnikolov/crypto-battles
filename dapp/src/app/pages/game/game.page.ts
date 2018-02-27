import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WalletService } from '../../services/wallet.service';
import { ContractService, Player } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';



@Component({
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.css']
})
export class GamePage {
  public player: Player;

  constructor(
    private router: Router,
    public wallet: WalletService,
    public contract: ContractService,
    public dialogService: DialogService

  ) {
    if (!this.wallet.getAddress()) {
      // user is not logged
      this.router.navigate(['login']);
      return;
    }

    this.contract.isRegistered().then((registered: boolean) => {
      if (!registered) {
        this.router.navigate(['login']);
        return;
      }
      else {
        this.wallet.unlock().then(() => {
          this.loadPlayer();
        })



        setInterval(() => {
          this.loadPlayer();
        }, 7000); // read the player every 7 sec
      }
    }).catch((err) => {
      dialogService.addError(err);
    })




  }

  public loadPlayer() {
    if (this.wallet.isUnlocked)
      this.contract.getPlayer(this.wallet.getAddress())
        .then((player: Player) => {
          this.player = player;
        })
        .catch(err => {
          this.dialogService.addError(err);
        })
  }


  public buyPeasants(peasants: number) {
    this.contract.buyPeasants(peasants).then((tx: Transaction) => {

      tx.onChange = (tx: Transaction) => {
        if (tx.status == 'confirmed') {
          // reload player
          this.loadPlayer();
        }
      };

      tx.onChange(tx);
    });
  }


  public buyMiners(miners: number) {
    this.contract.buyMiners(miners).then((tx: Transaction) => {

      tx.onChange = (tx: Transaction) => {
        if (tx.status == 'confirmed') {
          // reload player
          this.loadPlayer();
        }
      };

      tx.onChange(tx);
    });
  }

  public buySolders(miners: number) {
    this.contract.buySolders(miners).then((tx: Transaction) => {

      tx.onChange = (tx: Transaction) => {
        if (tx.status == 'confirmed') {
          // reload player
          this.loadPlayer();
        }
      };

      tx.onChange(tx);
    });
  }

}
