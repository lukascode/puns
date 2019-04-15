import { Injectable } from '@angular/core';
import {WebsocketService} from '../../../shared/services/websocket/websocket.service';
import {GameRoom} from '../../../shared/abstract/abstract';
import {Observable} from 'rxjs';
import {EndRoundDetails, StartRoundDetails, YourTurnDetails} from './game-room.model';

@Injectable({
  providedIn: 'root'
})
export class GameRoomService implements GameRoom {

  constructor(private websocket: WebsocketService) {}

  onEndRoundDetails(roomId): Observable<EndRoundDetails> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/end-round-details`, (details: EndRoundDetails) => {
        obs.next(details);
      });
    });
  }

  onStartRoundDetails(roomId): Observable<StartRoundDetails> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/start-round-details`, (details: StartRoundDetails) => {
        obs.next(details);
      });
    });
  }

  onYourTurn(roomId): Observable<YourTurnDetails> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/your-turn`, (details: YourTurnDetails) => {
        obs.next(details);
      });
    });
  }

  onYouAreWinner(roomId): Observable<void> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/you-are-winner`, () => {
        obs.next();
      });
    });
  }

}
