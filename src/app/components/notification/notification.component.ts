import { NotificationService } from './../../service/nofication.service';
import {
  Component,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ToastService } from '../../service/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { PageEmptyComponent } from '../page-empty/page-empty.component';
import { convertToVietnameseDate } from '../../helper/convertToVNDate';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ReminderModel } from '../../models/reminder.model';
import { Router } from '@angular/router';
import { typeNotification } from '../../constants/util';
import { Observable, Subscription } from 'rxjs';
import { NotificationItem, NotificationPayload } from '../../models/payload-realtime';
import { SignalrService } from '../../service/signalr/signalr.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification',
  imports: [
    NzDropDownModule,
    CommonModule,
    PageEmptyComponent,
    NzToolTipModule,
    NzCollapseModule,
    FormsModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit,OnDestroy {
  private destroyRef = inject(DestroyRef);
  isLoading = true;
  listNotification: ReminderModel[] = [];
  isEmptlist = false;
  totalNotificationIsNotRead: number = 0;
  dateTimeNow: string = '';
  data$!: Observable<ReminderModel[]>;
  realtimeNotifications: NotificationItem[]=[];
  //sub cho realtime
  private sub = new Subscription();

  constructor(
    private toastService: ToastService,
    private NotiService: NotificationService,
    private route: Router,
    private signalrService : SignalrService
  ) {}
  

  ngOnInit(): void {
    this.signalrService.startConnection();

    // Subscribe thông báo realtime
    this.sub.add(
      this.signalrService.notification$.subscribe(msg => {
        if (msg) {
          const item: NotificationItem = { ...msg, isRead: false };
          this.realtimeNotifications.unshift(item);
          console.log('[Reminder] Realtime Notification:', msg);
        }
      })
    );
    this.dateTimeNow = convertToVietnameseDate(new Date().toISOString());
    this.data$ = this.NotiService.onRefresh();
    this.loadData();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe(); // tránh memory leak
  }
  ChangeIsRead(item: ReminderModel) {
    if (!item.isNotified) {
      item.isNotified = true;
      this.maskreadNoti(item.reminderId.toString());
      // Không cần gọi loadData vì maskRead trong service đã gọi triggerRefresh
    }
    if (
      item.type == typeNotification.createTask ||
      item.type == typeNotification.putDeadlineTask ||
      item.type == typeNotification.taskReminder
    ) {
      this.route.navigate(['/viecduocgiao'], {
        queryParams: { highlightId: item.taskid, _t: Date.now() },
      });
    }
    if (item.type == typeNotification.updateProgress) {
      // this.toastService.Info('Tính năng đang phát triển !')
      // this.route.navigate(['/viecduocgiao']);
    }
  }
  //kiểm tra thông báo realtime đã đọc chưa
  markNotificationRead(item: NotificationItem) {
  if (!item.isRead) {
    item.isRead = true;
    console.log('[Reminder] Marked as read:', item.title);
  }
}
  //click chuông đồng nghĩa thông báo được đọc
  markAllNotificationRead()
  {
    this.realtimeNotifications.forEach(r => {
      r.isRead = true;
    });
    this.listNotification.forEach(r => {
      r.isNotified =true;
    });
    this.updateUnreadCount();
  }

  maskreadNoti(reminderId: string) {
    
    
    this.NotiService.maskRead(reminderId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Dữ liệu sẽ được làm mới tự động qua triggerRefresh trong service
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  loadData() {
    this.isLoading = true;
    this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => {
        if (list.length === 0) {
          this.isEmptlist = true;
        } else {
          this.totalNotificationIsNotRead = list.filter(
            (r) => !r.isNotified
          ).length;
          this.isEmptlist = false;
          this.listNotification = list;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.Error(err.message || 'Lấy dữ liệu thất bại !');
      },
    });
    this.updateUnreadCount();
  }

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec} giây trước`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} giờ trước`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} ngày trước`;
  }

  convertDate(date: string): string {
    return convertToVietnameseDate(date);
  }
  //tính tổng thông báo chưa đọc
  private updateUnreadCount() {
  const unreadRealtime = this.realtimeNotifications.filter(r => !r.isRead).length;
  const unreadDb = this.listNotification.filter(r => !r.isNotified).length;
  this.totalNotificationIsNotRead = unreadRealtime + unreadDb;
}

}
