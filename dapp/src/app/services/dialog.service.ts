import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PromptDialog, PromptSettings } from '../dialogs/prompt/prompt.dialog';


@Injectable()
export class DialogService {

  constructor(
    public dialog: MatDialog
  ) { }

  private alerts: Alert[] = [];


  public prompt(text: string, settings: {
    defaultValue?: string,
    inputType?: string,
    validators?: any[],
    disableClose?: boolean
  } = {}): Promise<string> {
    return new Promise((resolve, reject) => {

      let settins: PromptSettings = {
        text: text,
        defaultValue: settings.defaultValue || '',
        inputType: settings.inputType || 'text',
        validators: settings.validators || [],
        resolve: resolve,
        reject: reject,
      };
      this.dialog.open(PromptDialog, { width: '350px', data: settins, disableClose: settings.disableClose });
    })
  }

  public getAlerts(): Alert[] {
    let alerts: Alert[] = [];

    this.alerts.forEach(alert => {
      if (!alert.is_deleted) {
        alerts.push(alert);
      }
    });

    return alerts;
  }

  public clearAlerts(): void {
    this.alerts.forEach(alert => {
      alert.is_deleted = true;
    });
  };

  private addAlert(type: string, text: string, timeout: number = 7000): void {
    let alert: Alert = {
      type: type,
      text: text,
      is_deleted: false
    };

    this.alerts.push(alert);

    if (timeout > 0) {
      setTimeout(() => {
        alert.is_deleted = true;
      }, timeout);
    }
  }

  public addError(text: string, timeout?: number): void {
    this.addAlert('danger', text, timeout);
  }

  public addMessage(text: string, timeout?: number): void {
    this.addAlert('info', text, timeout);
  }
}

export interface Alert {
  type: string,
  text: string,
  is_deleted: boolean
}