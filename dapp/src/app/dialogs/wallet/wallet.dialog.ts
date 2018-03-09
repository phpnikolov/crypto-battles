import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { WalletService } from '../../services/wallet.service';

import * as Utils from 'web3-utils';
import { Transaction } from '../../interfaces/transaction';

import { BigInteger } from 'big-integer';
import * as bigInt from 'big-integer';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.dialog.html',
  styleUrls: ['./wallet.dialog.css']
})
export class WalletDialog {

  public balance: number;

  constructor(
    public dialogRef: MatDialogRef<WalletDialog>,
    public wallet: WalletService,
    private dialogService: DialogService
  ) {
    this.updateBalance();

    setInterval(() => {
      this.updateBalance();
    }, 13000);

  }

  private wei2eter(wei: string) {
    return parseFloat(Utils.fromWei(wei, 'ether'));
  }

  private updateBalance() {
    this.wallet.getBalance()
      .then((balance: string) => {
        this.balance = this.wei2eter(balance);
      })
      .catch(() => {
        this.balance = undefined;
      })
  }


  public getFee(tx: Transaction): number {
    return this.wei2eter(bigInt(tx.gasPrice).times(tx.gasLimit).toString());
  }

  public showMnemonic(): void {
    this.wallet.getPasswordDerivedKey().then((pwDerivedKey) => {
      let mnemonic = this.wallet.ks.getSeed(pwDerivedKey);
      this.dialogService.prompt('Your mnemonic is', { defaultValue: mnemonic, disableClose: true });
    }).catch(() => {

    })
  }

  public showAddress(): void {
    this.dialogService.prompt('Your address is', { defaultValue: this.wallet.address, disableClose: true });
  }


}