import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicHttpClient} from '../abstract/abstract';
import {environment} from '../../../environments/environment';
import {UpdatePlayerAvatar} from './node-api.model';
import {Observable} from 'rxjs';
import {WebsocketService} from './websocket/websocket.service';
import {switchMap, tap} from 'rxjs/operators';
import {PlayerAccountService} from '../../dashboard/player-account/player-account.service';
import {PlayerSnapshot} from '../../dashboard/player-account/player-account.model';

@Injectable({
  providedIn: 'root'
})
export class NodeApiService  extends BasicHttpClient {

  constructor(private http: HttpClient, private playerAccountService: PlayerAccountService, private websocket: WebsocketService) {
    super(environment.nodeApiUrl);
    this.playerAccountService.playerAvatarChanged.pipe(
      switchMap(() => this.playerAccountService.getCurrentPlayer()),
      switchMap((player: PlayerSnapshot) => this.updatePlayerAvatar(new UpdatePlayerAvatar(player.id, player.avatarId)))
    ).subscribe();
  }

  updatePlayerAvatar(rq: UpdatePlayerAvatar): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}public-chat/update-player-avatar`, rq).pipe(
      tap(() => this.websocket.getSocket().emit('player-changed-avatar', rq))
    );
  }

}
