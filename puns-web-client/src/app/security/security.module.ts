import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { NotAuthenticatedGuardService } from './not-authenticated-guard.service';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from './auth-interceptor.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class SecurityModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SecurityModule,
      providers: [
        AuthService,
        SessionService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
        NotAuthenticatedGuardService,
        AuthenticatedGuardService
      ]
    };
  }
}
