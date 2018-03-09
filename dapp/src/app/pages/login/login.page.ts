import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { ContractService } from '../../services/contract.service';

import { DialogService } from '../../services/dialog.service';
import { Transaction } from '../../interfaces/transaction';
import { keystore } from "eth-lightwallet";

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {

  public showCreateWallet: boolean;

  constructor(
    private router: Router,
    public contract: ContractService,
    public wallet: WalletService,
    private dialogService: DialogService
  ) {

    this.showCreateWallet = !wallet.getAddress();
  }

  public importMnemonic(): void {
    this.getMnemonic().then((mnemonic: string) => {
      this.getPassword().then((pwd: string) => {

        this.wallet.saveKs(mnemonic, pwd).then(() => {
          // successfully registered, go to the game
          this.router.navigate(['/game']);

        }).catch((err) => {
          this.dialogService.addError(err);
        });
      }).catch(() => { })
    }).catch(() => { });
  }

  private getMnemonic(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dialogService.prompt('Enter your mnemonic').then((mnemonic: string) => {
        if (!keystore.isSeedValid(mnemonic)) {
          this.dialogService.addError('Invalid mnemonic.');
          this.getMnemonic().then(resolve).catch(reject);
        }
        else {
          resolve(mnemonic);
        }
      }).catch(reject);
    });
  }


  private getPassword(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.dialogService.prompt('Enter password', { inputType: 'password' }).then((password: string) => {
        this.dialogService.prompt('Confirm password', { inputType: 'password' }).then((password2: string) => {
          if (password != password2) {
            this.dialogService.addError('Passwords not match.');
            this.getPassword().then(resolve).catch(reject);
          }
          else {
            resolve(password);
          }

        }).catch(reject);
      }).catch(reject);
    });
  }

}
