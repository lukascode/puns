import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../../../environments/environment';
import {PlayerAccountService} from '../../../dashboard/player-account/player-account.service';
import {PlayerSnapshot} from '../../../dashboard/player-account/player-account.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  private playerDetailsReceived = false;

  constructor(private playerAccountService: PlayerAccountService) {
  }

  connect() {
    this.socket = io(environment.wsServer);
    this.socket.on('connect', () => {
        console.log('Connection to ws server established successfully');
        this.playerDetailsReceived = false;
        this.sendPlayerDetails();
    });
    this.socket.on('player-details-received', () => {
      this.playerDetailsReceived = true;
    });
    this.socket.on('reconnect', () => {
      console.log('Reconnected to ws server successfully');
      this.playerDetailsReceived = false;
      this.sendPlayerDetails();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  getSocket() {
    return this.socket;
  }

  onPlayerDetailsReceived(): Observable<void> {
    return Observable.create(obs => {
        if (this.playerDetailsReceived) {
          obs.next();
        } else {
          this.socket.on('player-details-received', () => {
            obs.next();
          });
        }
    });
  }

  private sendPlayerDetails() {
    this.playerAccountService.getCurrentPlayer().subscribe((player: PlayerSnapshot) => {
      this.socket.emit('player-details', {
        id: player.id,
        email: player.email,
        nick: player.nick,
        avatarId: player.avatarId
      });
    });
  }


}
