import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';

import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {

  constructor(
    private router: Router,
    public contract: ContractService,
    public wallet: WalletService,
    private dialogService: DialogService
  ) {

    if (!wallet.getAddress()) {
      // The user don't have account in localStorage, redirect to register
      this.router.navigate(['register']);
      return;
    }

    this.router.navigate(['game']);
  }

}
