import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-not-enough-balance',
  templateUrl: './not-enough-balance.dialog.html',
  styleUrls: ['./not-enough-balance.dialog.css']
})
export class NotEnoughBalanceDialog {

  constructor(
    public dialogRef: MatDialogRef<NotEnoughBalanceDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: { address: string }
  ) { }

}
