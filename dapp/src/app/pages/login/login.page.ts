import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';
import { Validators } from '@angular/forms';
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

    // check if this account is registered into the contract
    this.contract.isRegistered()
      .then((registered: boolean) => {;

        if (registered) {
          // user is registered go to the game
          this.router.navigate(['game']);
          return;
        }
        let validators = [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(12)
        ];

        // select username and add this account to the contract
        this.dialogService.prompt('Select username', { validators: validators, disableClose: true }).then((username: string) => {

          // register address in the contrct
          this.contract.register(username).then((tx: Transaction) => {

            // go to the game when transaction is confirmed
            tx.onChange = (tx: Transaction) => {
              if (tx.status === 'confirmed') {
                this.router.navigate(['game']);
              }
            }

            tx.onChange(tx);

            return;

          }).catch((err) => {
            this.dialogService.addError(err);
          });
        });

      })
      .catch((err) => {
        this.dialogService.addError(err);
      })
  }

}
