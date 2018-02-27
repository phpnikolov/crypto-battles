import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-tx-watcher',
  templateUrl: './tx-watcher.component.html',
  styleUrls: ['./tx-watcher.component.css']
})
export class TxWatcherComponent implements OnInit {

  constructor(
    public wallet:WalletService
  ) { }

  ngOnInit() {
  }

}
