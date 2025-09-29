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
import { NotificationPayload } from '../../interface/payload-realtime';
import { SignalrService } from '../../service/signalr/signalr.service';

@Component({
  selector: 'app-notification',
  imports: [
    NzDropDownModule,
    CommonModule,
    PageEmptyComponent,
    NzToolTipModule,
    NzCollapseModule,
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
  realtimeNotifications: NotificationPayload[]=[];
  private sub = new Subscription();

  constructor(
    private toastService: ToastService,
    private NotiService: NotificationService,
    private route: Router,
    private signalrService : SignalrService
  ) {}
  

  ngOnInit(): void {
    this.signalrService.startConnection();

    // 2️⃣ Subscribe thông báo realtime
    this.sub.add(
      this.signalrService.notification$.subscribe(msg => {
        if (msg) {
          this.realtimeNotifications.unshift(msg);
          console.log('[Reminder] 🔔 Realtime Notification:', msg);
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
          this.totalNotificationIsNotRead = 0;
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
}
