import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WalletService } from '../../services/wallet.service';
import { ContractService, Player } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';



@Component({
  templateUrl: './castle.page.html',
  styleUrls: ['./castle.page.css']
})
export class CastlePage {
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
        this.init();
      }
    }).catch((err) => {
      dialogService.addError(err);
    })




  }

  public init() {
    this.contract.getPlayer(this.wallet.getAddress()).then((player: Player) => {
      this.player = player;
    })
  }

}
