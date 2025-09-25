import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ViecduocgiaoModel } from '../models/viecduocgiao.model';
import { environment } from '../environment/environment';
import { ResponseApi } from '../interface/response';
import { ResponsePaganation } from '../interface/response-paganation';

@Injectable({ providedIn: 'root' })
export class ViecduocgiaoService {
  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  getAllData(
    currentPage: string
  ): Observable<ResponsePaganation<ViecduocgiaoModel>> {
    const url = `${this.apiUrl}subtask/assigned?page=${currentPage}&pageSize=10`;

    return this.http
      .get<ResponseApi<ResponsePaganation<ViecduocgiaoModel>>>(url)
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
}
