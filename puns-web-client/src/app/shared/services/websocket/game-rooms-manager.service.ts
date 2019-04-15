import { Injectable } from '@angular/core';
import {WebsocketService} from './websocket.service';
import {Observable} from 'rxjs';
import {GameRoomSummary} from './game-rooms-manager.model';

@Injectable({
  providedIn: 'root'
})
export class GameRoomsManagerService {

  constructor(private websocket: WebsocketService) { }

  createRoom(name) {
    this.websocket.getSocket().emit('game-rooms/create-room', name);
  }

  deleteRoom(roomId) {
    this.websocket.getSocket().emit('game-rooms/delete-room', roomId);
  }

  getAllRooms() {
    this.websocket.getSocket().emit('game-rooms/get-all-rooms');
  }

  onAllGameRooms(): Observable<GameRoomSummary[]> {
    return Observable.create(obs => {
      this.websocket.getSocket().on('game-rooms/state', (response: GameRoomSummary[]) => {
          obs.next(response);
      });
    });
  }

}
