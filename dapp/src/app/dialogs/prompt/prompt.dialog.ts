import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  templateUrl: './prompt.dialog.html',
  styleUrls: ['./prompt.dialog.css']
})

export class PromptDialog {

  public fg: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PromptDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: PromptSettings
  ) {


    this.fg = fb.group({
      'answer': [this.data.defaultValue, this.data.validators]
    });
  }

  get answer() { return this.fg.get('answer'); }


  public send(): void {
    this.dialogRef.close();
    this.data.resolve(this.fg.get('answer').value);
  }

  public cancel(): void {
    this.dialogRef.close();
    this.data.reject();
  }
}


export interface PromptSettings {
  text: string,
  defaultValue: string,
  inputType: string,
  validators: any[],
  resolve: (value: string) => void,
  reject: () => void,
}