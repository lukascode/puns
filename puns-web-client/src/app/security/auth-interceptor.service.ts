import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from './session.service';
import {AuthService} from './auth.service';
import {LoggerService} from '../shared/services/logger.service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {AlertService} from 'ngx-alerts';
import {catchError, filter, finalize, switchMap, take, tap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  private static TOKEN_HEADER = 'Authorization';

  private static TOKEN_TYPE = 'Bearer';

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private log: LoggerService,
    private auth: AuthService,
    private alert: AlertService,
    private session: SessionService,
    private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      const startTime = Date.now();
      let status: string;

      if (!this.isPublicRequest(req)) {
        if (this.auth.isAuthenticated()) {
          req = this.addToken(req, this.session.getRawAccessToken());
        } else {
          if (this.session.isRefreshTokenExpired()) {
            this.sessionExpired();
          }
        }
      }

      return next.handle(req).pipe(
        catchError(error => {
          if (this.match(req.url, 'token/new')) {
            return throwError(error);
          }
          if (this.match(req.url, 'token/refresh')) {
            this.sessionExpired();
            return throwError(error);
          }
          if (error.status !== 401) {
            return throwError(error);
          }
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(() => next.handle(this.addToken(req, this.session.getRawAccessToken())))
            );
          } else {
            if (this.session.isRefreshTokenExpired()) {
              this.sessionExpired();
              return  throwError(error);
            }
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);
            return this.auth.refreshAccessToken().pipe(
              switchMap((token) => {
                this.refreshTokenInProgress = false;
                this.refreshTokenSubject.next(token);
                return next.handle(this.addToken(req, this.session.getRawAccessToken()));
              }),
              catchError(err => {
                this.refreshTokenInProgress = false;
                this.sessionExpired();
                return throwError(err);
              })
            );
          }
        }),
        tap((event: HttpEvent<any>) => {
          status = '';
          if (event instanceof HttpResponse) {
            status = 'succeeded';
          }
        }, (err: any) => {
          status = 'failed';
          this.log.error('[AuthInterceptorService]', err);
          if (err instanceof HttpErrorResponse) {
            if (err.error instanceof ErrorEvent) {
              this.alert.danger('Unexpected error occurred. Check console');
            } else if (err.status === 404) {
              this.alert.danger('Nie znaleziono zasobu');
            } else {
              if (err.status >= 500) {
                this.alert.danger(`Wystąpił niespodziewany błąd serwera, status odpowiedzi: ${err.status} ${err.statusText}. Sprawdź konsolę`);
              }
            }
          }
        }),
        finalize(() => {
          const elapsedTime = Date.now() - startTime;
          this.log.info(`[AuthInterceptorService] ${req.method} ${req.urlWithParams} ${status} in ${elapsedTime}ms`);
        })
      );

    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
      return req.clone({ headers: req.headers.set(AuthInterceptorService.TOKEN_HEADER, `${AuthInterceptorService.TOKEN_TYPE} ${token}`)});
    }

    private isPublicRequest(req: HttpRequest<any>) {
      return this.match(req.url, 'token/new') ||
             this.match(req.url, 'player/register')  ||
             this.match(req.url, 'assets') ||
             this.match(req.url, 'nick-taken') ||
             this.match(req.url, 'email-taken') ||
             this.match(req.url, 'token/refresh');
    }

    private match(url, subpath) {
      if (url.indexOf(subpath) >= 0) {
        return true;
      }
      return false;
    }

    private sessionExpired() {
      this.auth.logout();
      this.router.navigate(['public/login']);
      this.alert.warning('Sesja wygasła. Zaloguj się ponownie');
    }

}
