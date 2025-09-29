import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';

export interface NotificationPayload {
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private notificationSubject = new BehaviorSubject<NotificationPayload | null>(null);
  notification$ = this.notificationSubject.asObservable();

  /** Bắt đầu kết nối tới Hub và lắng nghe sự kiện ReceiveNotification */
  startConnection(onNotify?: (data: NotificationPayload) => void) {
    if (this.hubConnection) return; // tránh start nhiều lần

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.realtimeURL}/notificationHub`, {
        accessTokenFactory: () => {
          const token = localStorage.getItem('accessToken');
          console.log('[SignalR] 🪪 token =', token); // giữ nguyên log
          return token || '';
        },
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('[SignalR] Connected to NotificationHub'); // giữ nguyên log

        // Lắng nghe event từ BE
        this.hubConnection.on('ReceiveNotification', (data: NotificationPayload) => {
          console.log('====================================================');
          console.log('[SignalR] Notification received!');
          console.log('[SignalR] Raw payload:', data);
          console.log('[SignalR] JSON:', JSON.stringify(data));
          console.log(' Title:', data.title);
          console.log(' Message:', data.message);
          console.log(' Timestamp:', data.timestamp);
          if (data.data) console.log('Extra Data:', data.data);
          console.log('====================================================');

          // 👇 phát dữ liệu qua Observable cho mọi component
          this.notificationSubject.next(data);

          // nếu ai đó truyền callback cũ thì vẫn gọi
          if (onNotify) onNotify(data);
        });
      })
      .catch(err => console.error('[SignalR]Error starting connection:', err));

    this.hubConnection.onclose(err => {
      console.warn('[SignalR]Connection closed:', err);
    });
  }

  sendMessage(method: string, data: any) {
    if (!this.hubConnection) {
      console.error('[SignalR] Hub connection chưa khởi tạo!');
      return;
    }
    return this.hubConnection.invoke(method, data);
  }
}
