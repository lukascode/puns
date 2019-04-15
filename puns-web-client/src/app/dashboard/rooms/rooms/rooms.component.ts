import { Component, OnInit } from '@angular/core';
import {GameRoomsManagerService} from '../../../shared/services/websocket/game-rooms-manager.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  constructor(private gameRoomsManager: GameRoomsManagerService) { }

  ngOnInit() {

  }

}
