import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';
import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';
import { PlayerService } from '../../services/player.service';

import { Validators } from '@angular/forms';

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

    this.wallet.unlock().then(() => {
      this.contract.isRegistered().then((registered: boolean) => {
        if (!registered) {
          this.register();
        }
        else {
          this.init();
        }
      }).catch((err) => {
        this.dialogService.addError("Can't connect to Provider");
      })
    });
  }


  private init() {
    this.startAutoLoading();
  }

  private startAutoLoading() {
    this.player.loadPlayer();
    this.player.loadItems();

    // don't use setInterval, because if tab is inactive for long time, reload will be triggerer millions of times...
    setTimeout(() => {
      this.startAutoLoading();
    }, 14 * 1000); // 14 sec
  }

  private register() {
    let validators = [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(12)
    ];

    // select username and add this account to the contract
    this.dialogService.prompt('Select username', { validators: validators, disableClose: true }).then((username: string) => {

      // register address in the contrct
      this.contract.register(username).then((tx: Transaction) => {
        let waitingMsg = () => {
          this.dialogService.addMessage('Please wait until your account is ready.', 4500);
        }

        waitingMsg();
        let timer = setInterval(() => {
          waitingMsg();
        }, 5000);

        // go to the game when transaction is confirmed
        tx.onChange = (tx: Transaction) => {
          if (tx.status === 'confirmed') {
            clearInterval(timer);
            this.dialogService.clearAlerts();
            this.init();
          }
        }

        tx.onChange(tx);

      }).catch((err) => {
        this.dialogService.addError(err);
      });
    });
  }
}
