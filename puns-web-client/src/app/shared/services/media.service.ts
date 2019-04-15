import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {AlertService} from 'ngx-alerts';
import {TranslateService} from '@ngx-translate/core';
import {BasicHttpClient} from '../abstract/abstract';
import {environment} from '../../../environments/environment';
import {FileUploadService} from './file-upload.service';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {LoggerService} from './logger.service';
import {MediaDownloadResponse} from './media.model';
import {Utils} from '../utils/utils';


@Injectable({
  providedIn: 'root'
})
export class MediaService extends BasicHttpClient {

  constructor(
    private http: HttpClient,
    private alert: AlertService,
    private translate: TranslateService,
    private uploader: FileUploadService,
    private log: LoggerService
    ) {
    super(environment.apiUrl);
  }

  uploadMedia(file: File): Observable<any> {
    const url = `${this.apiUrl}media/upload`;
    return this.uploader.upload(url, file)
      .pipe(
        tap((event: any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              this.log.info(`Uploading file '${file.name}' of size ${file.size}`);
              break;
            case HttpEventType.UploadProgress:
              const percentDone = Math.round(100 * event.loaded / event.total);
              this.log.info(`File "${file.name}" is ${percentDone}% uploaded`);
              break;
            case HttpEventType.Response:
              this.log.info(`File "${file.name}" was completely uploaded`);
              this.alert.success(this.translate.instant('file_uploaded_successfully'));
              break;
          }
        }),
        catchError((err: HttpErrorResponse) => {
          let errStr: string = this.translate.instant('file_uploading_error');
          if (err.status === 415) {
            errStr += '. ' + this.translate.instant('media_type_unsupported');
          } else if (err.status === 413) {
            errStr += '. ' + this.translate.instant('file_too_large');
          }
          this.alert.danger(errStr);
          return throwError(err);
        })
    );
  }

  downloadMedia(uuid: string): Observable<MediaDownloadResponse> {
    const url = `${this.apiUrl}media/download/${uuid}`;
    return this.http.get(url, { observe: 'response', responseType: 'blob'})
      .pipe(
        map((response: HttpResponse<Blob>) => {
          return new MediaDownloadResponse(response.body, Utils.getContentDispositionName(response));
        })
      );
  }

}


