import { Injectable } from '@angular/core';
import {BasicHttpClient} from '../../shared/abstract/abstract';
import {environment} from '../../../environments/environment';
import {PlayerRegisterRequest} from './register.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BasicHttpClient {

  constructor(private http: HttpClient) {
    super(environment.apiUrl);
  }

  registerPlayer(rq: PlayerRegisterRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}player/register`, rq);
  }

  isEmailTaken(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}player/email-taken/${email}`);
  }

  isNickTaken(nick: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}player/nick-taken/${nick}`);
  }

}
