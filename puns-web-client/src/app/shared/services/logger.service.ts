import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoggerService {

  info(value: any, ...rest) {
    if(!environment.production) {
      console.log(value, ...rest);
    }
  }

  warn(value: any, ...rest) {
    console.warn(value, ...rest);
  }

  error(value: any, ...rest) {
    console.error(value, ...rest);
  }

}
