import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { map, Observable } from 'rxjs';
import { ResponseApi } from '../interface/response';

@Injectable({
  providedIn: 'root',
})
export class SendRemindService {
  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }
  sendRemindUsers(object: {}): Observable<void> {
    const url = `${this.apiUrl}Reminder/create-by-user`;

    return this.http.post<ResponseApi>(url, object).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return;
        }
      })
    );
  }
  sendRemindUnits(object: {}): Observable<void> {
    const url = `${this.apiUrl}Reminder/create-by-unit`;

    return this.http.post<ResponseApi>(url, object).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return;
        }
      })
    );
  }
}
