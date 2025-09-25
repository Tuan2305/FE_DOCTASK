import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { DetailViecquanlyModel } from '../models/detail-viecquanly.model';
import { ResponseApi } from '../interface/response';
import { ResponsePaganation } from '../interface/response-paganation';

@Injectable({
  providedIn: 'root',
})
export class DetailViecquanlyService {
  private refreshTrigger$ = new BehaviorSubject<void>(undefined); // BehaviorSubject để kích hoạt refresh
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  // Phương thức để kích hoạt refresh
  triggerRefresh() {
    this.refreshTrigger$.next();
  }

  // Observable để component subscribe và nhận dữ liệu khi refresh
  onRefresh(
    taskId: string,
    pageNumber: string
  ): Observable<ResponsePaganation<DetailViecquanlyModel>> {
    return this.refreshTrigger$.pipe(
      switchMap(() => this.getAllData(taskId, pageNumber))
    );
  }

  getAllData(
    taskId: string,
    pageNumber: string
  ): Observable<ResponsePaganation<DetailViecquanlyModel>> {
    const url = `${this.apiUrl}subtask/by-parent-task/${taskId}?page=${pageNumber}&pageSize=10`;
    return this.http
      .get<ResponseApi<ResponsePaganation<DetailViecquanlyModel>>>(url)
      .pipe(
        map((res) => {
          if (!res.success) throw Error(res.message);

          return res.data;
        })
      );
  }
  editDetailViecQuanly(taskId: string, object: {}): Observable<void> {
    const url = `${this.apiUrl}taskAssignment/Update-ChildTask?idtask=${taskId}`;

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
