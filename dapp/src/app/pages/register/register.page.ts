import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { keystore } from "eth-lightwallet";
import { DialogService } from '../../services/dialog.service';

@Component({
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css']
})
export class RegisterPage {

  private seedPhrase: string = keystore.generateRandomSeed();
  public step: number = 1;
  public fg: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public wallet: WalletService,
    private dialogService: DialogService
  ) {


    this.fg = fb.group({
      'confirmMnemonic': [''],
      'password': ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      'confirmPassword': ['']
    },
      {
        validator: (AC: AbstractControl) => {
          if (AC.get('password').value != AC.get('confirmPassword').value) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
          }

          if (this.seedPhrase != AC.get('confirmMnemonic').value) {
            AC.get('confirmMnemonic').setErrors({ MatchMnemonic: true })
          }
        }
      }
    );
  }

  get confirmMnemonic() { return this.fg.get('confirmMnemonic'); }
  get password() { return this.fg.get('password'); }
  get confirmPassword() { return this.fg.get('confirmPassword'); }


  public create() {
    this.wallet.saveKs(this.seedPhrase, this.fg.get('password').value).then(() => {
      // successfully registered, go to the game
      this.router.navigate(['/game']);

    }).catch((err) => {
      this.dialogService.addError(err);
    });
  }


}

