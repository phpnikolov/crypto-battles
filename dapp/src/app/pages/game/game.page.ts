import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';
import { PlayerService } from '../../services/player.service';



@Component({
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.css']
})
export class GamePage {

  constructor(
    private router: Router,
    public wallet: WalletService,
    public contract: ContractService,
    public dialogService: DialogService,
    public player: PlayerService

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
        //this.wallet.unlock().then(() => {
        player.load();
        //}

        setInterval(() => {
          player.load();
        }, 7500); // read the player every 7.5 sec
      }
    }).catch((err) => {
      this.dialogService.addError(err);
    })
  }
}
