import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { map, Observable } from 'rxjs';
import { ResponseApi } from '../interface/response';
import {
  DetailProgressTaskChildModel,
  DetailProgressTaskParentModel,
} from '../models/detail-progress.model';
import { ResponsePaganation } from '../interface/response-paganation';

@Injectable({
  providedIn: 'root',
})
export class DetailProgressService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  detailProgressTaskChild(
    taskId: string
  ): Observable<DetailProgressTaskChildModel> {
    const url = `${this.apiUrl}review/detail-progress-taskchildren?taskId=${taskId}`;
    return this.http.get<ResponseApi<DetailProgressTaskChildModel>>(url).pipe(
      map((res) => {
        if (!res.success) throw new Error(res.message);
        // console.log(res.data )
        return res.data;
      })
    );
  }
  detailProgressTaskParent(
    taskId: string,
    currentPage: string
  ): Observable<DetailProgressTaskParentModel> {
    const url = `${this.apiUrl}review/detail-TaskParent?parentTaskId=${taskId}&page=${currentPage}&pageSize=5`;
    return this.http.get<ResponseApi<DetailProgressTaskParentModel>>(url).pipe(
      map((res) => {
        if (!res.success) throw new Error(res.message);
        // console.log(res.data )
        return res.data;
      })
    );
  }
}
