import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasicHttpClient } from '../shared/abstract/abstract';
import { environment } from '../../environments/environment';
import { LoggerService } from '../shared/services/logger.service';
import { Observable } from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AccessTokenResponse, ChangePassRequest, UserCredentials} from './security.model';
import { SessionService } from './session.service';
import {WebsocketService} from '../shared/services/websocket/websocket.service';

@Injectable()
export class AuthService extends BasicHttpClient {

  constructor(private http: HttpClient, private session: SessionService, private websocket: WebsocketService, private log: LoggerService) {
    super(environment.apiUrl);
  }

  isAuthenticated() {
    return !this.session.isAccessTokenExpired();
  }

  login(creds: UserCredentials): Observable<void> {
    this.log.info(`Trying authorize { nick: ${creds.nick}} ...`);
    return this.http.post<AccessTokenResponse>(`${this.apiUrl}player/token/new`, creds)
      .pipe(
        map((at: AccessTokenResponse) => {
          this.log.info(`User ${creds.nick} authorized successfully`);
          this.session.storeAccessToken(at);
        })
      );
  }

  logout() {
    this.session.clearSession();
    this.websocket.disconnect();
  }

  refreshAccessToken(): Observable<AccessTokenResponse> {
    this.log.info('Trying refresh token ...');
      return this.http.post<AccessTokenResponse>(`${this.apiUrl}player/token/refresh`, { refreshToken: this.session.getRawRefreshToken() })
        .pipe(
          tap((at: AccessTokenResponse) => {
            this.log.info(`Refreshed token successfully`);
            this.session.storeAccessToken(at);
          })
        );
  }

  changePassword(rq: ChangePassRequest): Observable<void> {
    this.log.info('Trying change password ...');
    return this.http.post<void>(`${this.apiUrl}player/change/password`, rq);
  }


}
