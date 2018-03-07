import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { DialogService } from '../../services/dialog.service';
import { WalletDialog } from '../../dialogs/wallet/wallet.dialog';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public player: PlayerService,
    private dialogService: DialogService,
    private walet: WalletService
  ) { }

  ngOnInit() {
  }

  public showWallet(): void {
    this.dialogService.dialog.open(WalletDialog);
  }

  get hasPendingTxs() : boolean {
    return this.walet.getPendingTransactions().length > 0;
  }

  get roundPassed() : number {
    return ((this.player.blockNumber - this.player.registrationBlock) % 500) / 5;
  }
}
