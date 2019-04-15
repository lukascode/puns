import {Injectable} from '@angular/core';
import {WebsocketService} from '../../shared/services/websocket/websocket.service';
import {Message, MessageRequest, Player} from './chat.model';
import {Observable} from 'rxjs';
import {SessionService} from '../../security/session.service';
import {BasicHttpClient, Chat} from '../../shared/abstract/abstract';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends BasicHttpClient implements Chat {

  private _joinFunc;

  constructor(private websocket: WebsocketService,
              private session: SessionService,
              private http: HttpClient) {
    super(environment.nodeApiUrl);
  }

  join(roomId) {
    this._join(roomId);
    this._joinFunc = this._join.bind(this, roomId);
    this.websocket.getSocket().on('reconnect', this._joinFunc);
  }

  leave(roomId) {
    this.websocket.getSocket().emit(`${roomId}/leave`);
    this.websocket.getSocket().removeListener('reconnect', this._joinFunc);
  }

  private _join(roomId) {
    this.websocket.getSocket().emit(`${roomId}/join`, this.session.getNick());
  }

  publishMessage(roomId, message, mediaId) {
    const msg = new MessageRequest(
      message,
      mediaId,
      roomId
    );
    this.websocket.getSocket().emit(`${roomId}/chat/message`, msg);
  }

  typing(roomId) {
    this.websocket.getSocket().emit(`${roomId}/chat/typing`);
  }

  onPlayerJoined(roomId) {
    return Observable.create(obs => {
        this.websocket.getSocket().on(`${roomId}/new-player-joined`, player => {
          obs.next(player);
        });
    });
  }

  onPlayerLeft(roomId) {
    return Observable.create(obs => {
        this.websocket.getSocket().on(`${roomId}/player-left-room`, player => {
            obs.next(player);
        });
    });
  }

  onTyping(roomId) {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/chat/typing`, (player: Player) => {
          obs.next(player);
      });
    });
  }

  onMessage(roomId) {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/chat/message`, (message: Message) => {
        obs.next(message);
      });
    });
  }

  getAllMessages(roomId): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}${roomId}/get-all-messages`);
  }

  onPresentState(roomId): Observable<Player[]> {
    return Observable.create(obs => {
        this.websocket.getSocket().on(`${roomId}/present-state`, (players: Player[]) => {
            obs.next(players.filter(p => p));
        });
    });
  }

}
