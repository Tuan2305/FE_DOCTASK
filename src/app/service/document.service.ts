import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { DocumentModel } from '../models/document.model';
import { environment } from '../environment/environment';
import { ResponseApi } from '../interface/response';
import { ResponsePaganation } from '../interface/response-paganation';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  apiUrl: string;
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  // Dữ liệu sẽ tự động gọi lại khi trigger thay đổi
  get documents$(): Observable<DocumentModel[]> {
    return this.refreshTrigger$.pipe(switchMap(() => this.getAllDoc()));
  }

  getAllDoc(): Observable<DocumentModel[]> {
  const url = `${this.apiUrl}file/user`;
  return this.http.get<ResponseApi<ResponsePaganation<DocumentModel>>>(url).pipe(
    map((res) => {
      if (!res.success) throw Error(res.message);
      return res.data.items;
    })
  );
}
  uploadDoc(formData: FormData): Observable<DocumentModel> {
    const url = `${this.apiUrl}UploadFile`;

    return this.http.post<ResponseApi<DocumentModel>>(url, formData).pipe(
      map((res) => {
        if (!res.success) throw Error(res.message);

        return res.data;
      })
    );
  }

  deleteDoc(id: string): Observable<ResponseApi> {
    const url = `${this.apiUrl}UploadFile/${id}`;

    return this.http.delete<ResponseApi>(url).pipe(
      map((res) => {
        if (!res.success) throw Error(res.message);

        return res.data;
      })
    );
  }
  triggerRefresh(): void {
    this.refreshTrigger$.next();
  }
}
