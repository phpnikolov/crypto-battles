import { Component, OnInit } from '@angular/core';
import { DialogService, Alert } from "../../services/dialog.service";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(public dialogService:DialogService) { }

  ngOnInit() {
  }

}

