import {Injectable} from '@angular/core';
import {MediaService} from './media.service';
import {Observable, of, Subject} from 'rxjs';
import {MediaDownloadResponse} from './media.model';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaDownloadProxyService {

  private mediaCache = new Map<string, { response: MediaDownloadResponse, subject: Subject<MediaDownloadResponse> }>();

  constructor(private mediaService: MediaService) {
  }

  downloadMedia(uuid: string): Observable<MediaDownloadResponse> {
    if (this.mediaCache.has(uuid)) {
      const obj = this.mediaCache.get(uuid);
      if (obj.response) {
        return of(obj.response);
      } else {
        return obj.subject;
      }
    }
    this.mediaCache.set(uuid, { response: null, subject: new Subject<MediaDownloadResponse>()});
    return this.mediaService.downloadMedia(uuid).pipe(
      tap((response: MediaDownloadResponse) => {
        this.mediaCache.get(uuid).response = response;
        this.mediaCache.get(uuid).subject.next(response);
      })
    );
  }

}
