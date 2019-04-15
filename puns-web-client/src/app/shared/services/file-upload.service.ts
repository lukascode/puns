import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) {}

  upload(url, file: File): Observable<any> {
    const headers = new HttpHeaders().set('Content-Disposition', `inline; filename="${file.name}"`);
    const req = new HttpRequest('POST', url, file, { reportProgress: true, headers:  headers});
    return this.http.request(req);
  }

}
