import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
import {AuthService} from '../../security/auth.service';
import {UserCredentials} from '../../security/security.model';
import {Utils} from '../../shared/utils/utils';
import {HttpErrorResponse} from '@angular/common/http';
import {LoggerService} from '../../shared/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  isProgressActive = false;

  isPasswordHidden = true;

  isLoginFailed = false;

  loginFailedErrorDescription = '';

  constructor(
    formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private alert: AlertService,
    private log: LoggerService
    ) {
    this.createForm(formBuilder);
  }

  ngOnInit() {}

  private createForm(formBuilder) {
    this.loginForm = formBuilder.group({
      nick: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.isLoginFailed = false;
    this.loginFailedErrorDescription = '';
    if(this.loginForm.valid) {
      this.isProgressActive = true;
      this.auth.login(
        new UserCredentials(this.loginForm.value.nick, this.loginForm.value.password),
      ).subscribe(() => {
        this.isProgressActive = false;
        this.router.navigate(['dashboard']);
        this.alert.success('Witaj w grze KALAMBURY');
      }, (err: HttpErrorResponse) => {
        this.isProgressActive = false;
        this.isLoginFailed = true;
        if (err.error instanceof ErrorEvent) {
          this.loginFailedErrorDescription = 'Wystąpił niespodziewany błąd podczas logowania';
        } else {
          if (err.error.message === 'BAD_CREDENTIALS') {
            this.loginFailedErrorDescription = 'Logowanie nie powiodło sie. Nieprawidłowe dane uwierzytelniania lub konto zostało zablokowane';
          } else if (err.status === 504) {
            this.loginFailedErrorDescription = 'Logowanie nie powiodło się. Sprawdź połączenie';
          } else {
            this.loginFailedErrorDescription = 'Wystąpił niespodziewany błąd serwera podczas logowania';
          }
        }
      });
    } else {
      Utils.markAllTouched(this.loginForm);
    }
  }

  register() {
    this.router.navigate(['public/register']);
  }

}
