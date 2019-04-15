import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from './auth.service';
import { AlertService } from 'ngx-alerts';
import {Observable} from 'rxjs';
import {SessionService} from './session.service';

@Injectable()
export class NotAuthenticatedGuardService implements CanActivate, CanActivateChild {

  constructor(private auth: AuthService, private session: SessionService, private router: Router, private alert: AlertService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isAuthenticated() || !this.session.isRefreshTokenExpired()) {
      return true;
    } else {
      this.router.navigate(['public/login']);
      this.alert.warning('Zaloguj się aby mieć dostęp do tego zasobu');
      return false;
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

}
