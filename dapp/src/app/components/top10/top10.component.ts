import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-top10',
  templateUrl: './top10.component.html',
  styleUrls: ['./top10.component.css']
})
export class Top10Component implements OnInit {

  public top10data: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private dialogService: DialogService
  ) { 

    this.load();
    setInterval(() => {
      this.load();
    }, 30000);
  }

  ngOnInit() {
  }

  private load(): void {
    this.httpClient.request('GET', `https://www.crypto-battles.com:8443/top10`, {
      responseType: 'json'
    }).subscribe(
      (data: any[]) => {
        this.top10data = data;
      },
      (httpErr) => {
        this.dialogService.addError("Can't get data for Top10. Please try again later.");
      });
  }
}

