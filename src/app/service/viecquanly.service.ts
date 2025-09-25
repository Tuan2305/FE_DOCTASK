import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ViecquanlyModel } from '../models/viecquanly.model';
import { environment } from '../environment/environment';
import { ResponseApi } from '../interface/response';
import { ResponsePaganation } from '../interface/response-paganation';
import { BehaviorSubject, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViecQuanlyService {
  private refreshTrigger$ = new BehaviorSubject<void>(undefined); // hoặc new Subject<void>()

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  triggerRefresh() {
    this.refreshTrigger$.next();
  }

  onRefresh(
    currentPage: string
  ): Observable<ResponsePaganation<ViecquanlyModel>> {
    return this.refreshTrigger$.pipe(
      switchMap(() => this.getAllData(currentPage))
    );
  }

  getAllData(
    currentPage: string
  ): Observable<ResponsePaganation<ViecquanlyModel>> {
    const url = `${this.apiUrl}GetListTask/by-assignedby?page=${currentPage}&pageSize=10`;

    return this.http
      .get<ResponseApi<ResponsePaganation<ViecquanlyModel>>>(url)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw Error(res.message);
          } else {
            return res.data;
          }
        })
      );
  }

  editViecQuanly(taskId: string, object: {}): Observable<void> {
    const url = `${this.apiUrl}taskAssignment/update-parenttask?taskId=${taskId}`;
    return this.http.put<ResponseApi<any>>(url, object).pipe(
      map((res) => {
        if (!res.success) {
          throw Error(res.message);
        } else {
          return res.data;
        }
      })
    );
  }
}
