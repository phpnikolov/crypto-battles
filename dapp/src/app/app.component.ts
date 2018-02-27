import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { WalletService } from './services/wallet.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public constructor(
    public wallet:WalletService
  ) {

  }

}
