import { AbstractControl, FormControl } from '@angular/forms';
import {HttpResponse} from '@angular/common/http';


export class Utils {

    static markAllTouched(control: AbstractControl) {
        if (control.hasOwnProperty('controls')) {
            control.markAsTouched();
            const ctrl = <any>control;
            for (let inner in ctrl.controls) {
                this.markAllTouched(ctrl.controls[inner] as AbstractControl);
            }
        } else {
            (<FormControl>control).markAsTouched();
        }
    }

    static getContentDispositionName(httpResponse: HttpResponse<any>) {
      const fname = function (contentDisp: string) {
        if (contentDisp) {
          let result: string = contentDisp.split(';')[1].trim().split('=')[1];
          return result.replace(/"/g, '');
        }
        const url = httpResponse.url;
        return url.substring(url.lastIndexOf('/') + 1);
      }(httpResponse.headers.get('Content-Disposition'));
      return fname;
    }


}
