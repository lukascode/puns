import {Injectable} from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from '@angular/forms';
import {RegisterService} from './register.service';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UniqueNickValidator implements AsyncValidator {

  constructor(private registerService: RegisterService) {}

  validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.registerService.isNickTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueNick: true } : null)),
      catchError(() => null)
    );
  }

}
