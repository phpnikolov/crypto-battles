import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.css']
})
export class ShopPage implements OnInit {

  constructor(
    public player: PlayerService
  ) { }

  ngOnInit() {
  }

}
