import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  templateUrl: './hero.page.html',
  styleUrls: ['./hero.page.css']
})
export class HeroPage implements OnInit {

  constructor(
    private player: PlayerService
  ) { }

  ngOnInit() {
  }

}
