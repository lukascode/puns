import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicHttpClient} from '../../shared/abstract/abstract';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {PlayerSnapshot} from './player-account.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerAccountService extends BasicHttpClient {


  playerAvatarChanged: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {
    super(environment.apiUrl);
  }

  getCurrentPlayer(): Observable<PlayerSnapshot> {
    return this.http.get<PlayerSnapshot>(`${this.apiUrl}player/current`);
  }

  setCurrentPlayerAvatar(resourceId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}player/set-avatar`, { resourceId: resourceId })
      .pipe(
        tap(() => this.playerAvatarChanged.next()),
      );
  }

  getAllPlayers(): Observable<PlayerSnapshot[]> {
    return this.http.get<PlayerSnapshot[]>(`${this.apiUrl}player/all`);
  }

}
