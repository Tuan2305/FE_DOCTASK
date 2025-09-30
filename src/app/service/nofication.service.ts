import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, startWith, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { ResponseApi } from '../interface/response';
import { ReminderModel } from '../models/reminder.model';
import { Metadata } from '../interface/response-paganation';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private refreshTrigger$ = new BehaviorSubject<void>(undefined); // BehaviorSubject để kích hoạt refresh
  apiUrl: string;

  constructor(private http: HttpClient, private toastService: ToastService) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  // Phương thức để kích hoạt refresh
  triggerRefresh() {
    this.refreshTrigger$.next();
  }

  // Observable để component subscribe và nhận dữ liệu khi refresh
  onRefresh(page: number, size: number): Observable<{ items: ReminderModel[]; metaData: Metadata }> {
  return this.refreshTrigger$.pipe(
    startWith(null), // load ngay lần đầu
    switchMap(() => this.getAll(page, size))
  );
}

getAll(page: number, size: number): Observable<{ items: ReminderModel[]; metaData: Metadata }> {
  const url = `${this.apiUrl}reminder?Page=${page}&Size=${size}`;

  return this.http
    .get<ResponseApi<{ items: ReminderModel[]; metaData: Metadata }>>(url)
    .pipe(
      map((res) => {
        if (res.success && res.data) {
          return {
            items: res.data.items ?? [],
            metaData: res.data.metaData,
          };
        }
        return {
          items: [],
          metaData: {
            pageIndex: 0,
            totalPages: 0,
            totalItems: 0,
            currentItems: 0,
            hasPrevious: false,
            hasNext: false,
          },
        };
      })
    );
}
  maskRead(notiId: string): Observable<void> {
    const url = `${this.apiUrl}Reminder/update-notify/${notiId}`;
    return this.http.put<ResponseApi>(url, {}).pipe(
      map((res) => {
        if (!res.success) {
          // this.toastService.Error(res.message);
          return;
        }
        // this.toastService.Success(res.message);
        this.triggerRefresh(); // Kích hoạt refresh sau khi đánh dấu đọc
        return;
      })
    );
  }

  maskAllRead(): Observable<void> {
    const url = `${this.apiUrl}NotificationUser/mark-read`;
    return this.http.put<ResponseApi>(url, {}).pipe(
      map((res) => {
        if (!res.success) {
          this.toastService.Error(res.message);
          return;
        }
        this.toastService.Success(res.message);
        this.triggerRefresh(); // Kích hoạt refresh sau khi đánh dấu tất cả đã đọc
        return;
      })
    );
  }
  
}
