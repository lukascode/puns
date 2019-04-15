import { Injectable } from '@angular/core';
import { AccessTokenResponse } from './security.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class SessionService {

  private static ACCESS_TOKEN = 'access_token';
  private static REFRESH_TOKEN = 'refresh_token';

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor() { }

  storeAccessToken(token: AccessTokenResponse) {
    localStorage.setItem(SessionService.ACCESS_TOKEN, token.access_token);
    localStorage.setItem(SessionService.REFRESH_TOKEN, token.refresh_token);
  }

  isAccessTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.getRawAccessToken());
  }

  isRefreshTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.getRawRefreshToken());
  }

  getNick(): string {
    const token = this.decodeToken(this.getRawAccessToken());
    return token ? token['user_name'] : 'guest';
  }

  decodeToken(token): any {
    return this.jwtHelper.decodeToken(token);
  }

  getRawAccessToken(): string {
    return localStorage.getItem(SessionService.ACCESS_TOKEN);
  }

  getRawRefreshToken(): string {
    return localStorage.getItem(SessionService.REFRESH_TOKEN);
  }

  clearSession() {
    localStorage.removeItem(SessionService.ACCESS_TOKEN);
    localStorage.removeItem(SessionService.REFRESH_TOKEN);
  }

}
