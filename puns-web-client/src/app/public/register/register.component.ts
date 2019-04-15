import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from 'ngx-alerts';
import {LoggerService} from '../../shared/services/logger.service';
import {Utils} from '../../shared/utils/utils';
import {PlayerRegisterRequest} from './register.model';
import {RegisterService} from './register.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UniqueEmailValidator} from './email-taken.validator';
import {UniqueNickValidator} from './nick-taken.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  isPasswordHidden = true;

  isProgressActive = false;

  isRegisterFailed = false;

  registerFailedErrorDescription = '';

  constructor(
    fb: FormBuilder,
    private router: Router,
    private alert: AlertService,
    private log: LoggerService,
    private registerService: RegisterService,
    private uniqueEmailValidator: UniqueEmailValidator,
    private uniqueNickValidator: UniqueNickValidator
  ) {
    this.createForm(fb);
  }

  ngOnInit() {
  }

  private createForm(fb: FormBuilder) {
    this.registerForm = fb.group({
      nick: ['', [Validators.required, Validators.maxLength(32)], [this.uniqueNickValidator.validate.bind(this.uniqueNickValidator)]],
      email: ['', [Validators.required, Validators.email], [this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator)]],
      password: ['', Validators.required]
    });
  }

  register() {
    this.isRegisterFailed = false;
    this.registerFailedErrorDescription = '';
    if (this.registerForm.valid) {
      this.isProgressActive = true;
      this.registerService.registerPlayer(this.createRegisterRequest()).subscribe(id => {
        this.isProgressActive = false;
        this.alert.success('Zarejestrowano pomyślnie. Zaloguj się');
        this.router.navigate(['public/login']);
      }, (err: HttpErrorResponse) => {
        this.isProgressActive = false;
        this.isRegisterFailed = true;
        if(err.error instanceof ErrorEvent) {
          this.registerFailedErrorDescription = 'Wystąpił niespodziewany błąd podczas rejestracji';
        } else {
          this.log.error('server side error', err);
          if (err.status === 504) {
            this.registerFailedErrorDescription = 'Logowanie nie powiodło się. Sprawdź połączenie';
          } else {
            this.registerFailedErrorDescription = 'Niespodziewany błąd po stronie serwera. Rejestracja nie powiodła się';
          }
        }
      });
    } else {
      Utils.markAllTouched(this.registerForm);
    }
  }

  private createRegisterRequest() {
    return new PlayerRegisterRequest(
      this.registerForm.value.email,
      this.registerForm.value.nick,
      this.registerForm.value.password,
    );
  }

}
