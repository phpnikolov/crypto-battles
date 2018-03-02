import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-hero',
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
