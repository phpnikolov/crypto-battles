import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { DialogService } from '../../services/dialog.service';
import { WalletDialog } from '../../dialogs/wallet/wallet.dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public player: PlayerService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
  }

  public showWallet(): void {
    this.dialogService.dialog.open(WalletDialog);
  }
}
