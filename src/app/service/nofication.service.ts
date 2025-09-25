import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { ResponseApi } from '../interface/response';
import { ReminderModel } from '../models/reminder.model';

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
  onRefresh(): Observable<ReminderModel[]> {
    return this.refreshTrigger$.pipe(switchMap(() => this.getAll()));
  }

  getAll(): Observable<ReminderModel[]> {
    const url = `${this.apiUrl}Reminder`;
    return this.http.get<ResponseApi<ReminderModel[]>>(url).pipe(
      map((res) => {
        if (!res.success) {
          console.log('Failed to fetch tasks');
          return [];
        }
        return res.data;
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
