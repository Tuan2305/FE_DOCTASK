import { Status } from './../../../../../constants/util';
import { CommonModule, Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { ToastService } from '../../../../../service/toast.service';
import { Observable } from 'rxjs';
import { ModalSendRemindComponent } from '../../../../../components/modal-send-remind/modal-send-remind.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ReviewChildJobService } from '../../../../../service/review-child-job.service';
import { ActivatedRoute } from '@angular/router';
import { ConvertStatusTask } from '../../../../../constants/util';
import { convertToVietnameseDate } from '../../../../../helper/convertToVNDate';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UserModel } from '../../../../../models/user.model';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ModalReviewProgressComponent } from '../../../../../components/modal-review-progress/modal-review-progress.component';
import { ResponsePaganation } from '../../../../../interface/response-paganation';
import { UserProgressModel } from '../../../../../models/review-job.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-review-child-job',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSwitchModule,
    NzPopoverModule,
    NzTableModule,
    ModalSendRemindComponent,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    ModalReviewProgressComponent,
  ],
  templateUrl: './review-child-job.component.html',
  styleUrl: './review-child-job.component.css',
})
export class ReviewChildJobComponent implements OnInit {
  @ViewChild(ModalSendRemindComponent)
  ModalSendRemindRef!: ModalSendRemindComponent;
  @ViewChild(ModalReviewProgressComponent)
  ModalReviewProgressRef!: ModalReviewProgressComponent;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private locationRoute: Location,
    private reviewChildJobService: ReviewChildJobService
  ) {}

  // ----
  pageSize = 10;
  totalItem = 0;
  isloadingTable = true;

  // ----
  taskId: Number | null = null;
  ListselectedUser: UserModel[] = [];
  ListselectUser: UserModel[] = [];
  checked = false;
  indeterminate = false;
  listOfData: GroupedUserProgress[] = [];
  setOfCheckedId = new Set<number>();
  isShowTableDataGroupByFrequency = false;
  isShowTableDataDefault = true;
  listOfCurrentPageData: GroupedUserProgress[] = [];
  listRemindUser: number[] = [];
  data$!: Observable<ResponsePaganation<UserProgressModel>>;
  private destroyRef = inject(DestroyRef);
  // ---
  startDate = new Date();
  endDate = new Date();
  ngOnInit(): void {
    this.startDate.setDate(this.endDate.getDate() - 7);
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.taskId = +params.get('id')!;
        // Khởi tạo data$ sau khi có taskId
        this.data$ = this.reviewChildJobService.onRefresh(
          this.taskId?.toString() ?? '',
          this.startDate.toISOString(),
          this.endDate.toISOString(),
          [],
          '1'
        );
        this.loadData();
        this.loadUsersSelect(this.taskId?.toString() ?? '');
      });
  }

  review() {
    this.data$ = this.reviewChildJobService.onRefresh(
      this.taskId?.toString() ?? '',
      this.startDate?.toISOString() ?? '',
      this.endDate?.toISOString() ?? '',
      this.ListselectedUser.map((user) => user.userId.toString()),
      '1'
    );
    this.loadData();
  }

  // Gọi triggerRefresh để làm mới dữ liệu
  refreshData() {
    this.reviewChildJobService.triggerRefresh();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
      this.listRemindUser.push(id);
    } else {
      this.setOfCheckedId.delete(id);
      this.listRemindUser = this.listRemindUser.filter((item) => item !== id);
    }
  }

  onPageChange(newPageIndex: number): void {
    this.data$ = this.reviewChildJobService.onRefresh(
      this.taskId?.toString() ?? '',
      this.startDate.toISOString(),
      this.endDate.toISOString(),
      this.ListselectedUser.map((user) => user.userId.toString()),
      newPageIndex.toString()
    );
    this.loadData();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.userId, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: GroupedUserProgress[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.userId)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.userId)
      ) && !this.checked;
  }

  // ---- send remind modal ----
  showModalSendRemind(id: string) {
    this.ModalSendRemindRef.showModal(id);
  }

  // -----  create report ----
  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  confirm(): void {
    // this.toastService.Success('Tạo báo cáo thành công !');
    // this.nzMessageService.info('click confirm');
  }

  beforeConfirm(): Observable<boolean> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 3000);
    });
  }
  //---- back route
  goBack() {
    this.locationRoute.back();
  }
  loadData(): void {
  this.isloadingTable = true;
  this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    next: (data) => {
      this.pageSize = data.pageSize;
      this.totalItem = data.totalItems;
      this.listOfData = data.items.map((user: any) => {
        const flattenedProgresses: FlatProgressRow[] =
          user.scheduledProgresses.flatMap((period: any) => {
            return period.progresses.map((prog: any) => ({
              periodIndex: period.periodIndex,
              periodStartDate: period.periodStartDate, // Thêm trường này
              periodEndDate: period.periodEndDate,     // Thêm trường này
              scheduledDate: `${this.convertDate(period.periodStartDate)} - ${this.convertDate(period.periodEndDate)}`, // Hiển thị khoảng thời gian
              progressId: prog.progressId,
              status: prog.status,
              result: prog.result,
              suggest: prog.proposal,
              feedback: prog.feedback,
              file: prog.fileName,
              filePath: prog.filePath,
            }));
          });

        return {
          userId: user.userId,
          userName: user.userName,
          progresses: flattenedProgresses,
          status: user.status,
        };
      });
      this.listOfCurrentPageData = [...this.listOfData];
      this.isloadingTable = false;
    },
    error: (err) => {
      this.isloadingTable = false;
      this.toastService.Warning(err.message ?? 'Lấy dữ liệu thất bại');
    },
  });
}

convertDate(dateString: string): string {
  if (!dateString || dateString === '0001-01-01T00:00:00') return 'Chưa xác định';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

  loadUsersSelect(taskId: string): void {
    this.reviewChildJobService.getUsersReview(taskId).subscribe({
      next: (data) => {
        this.ListselectUser = data;
      },
      error: (err) => {
        this.toastService.Warning(
          err.message ?? 'Lấy danh sách người dùng thất bại !'
        );
      },
    });
  }

  getLinkFileReport(filepath: string) {
    this.reviewChildJobService.getFileReport(filepath).subscribe({
      next: (link) => {
        window.open(link, '_blank');
      },
      error: () => {
        this.toastService.Warning('Không lấy được liên kết tải về');
      },
    });
  }
  goReviewFileReport(filepath: string) {
    this.reviewChildJobService.getFileReport(filepath).subscribe({
      next: (link) => {
        const linkPreview =
          'https://docs.google.com/gview?url=' + link + '&embedded=true';
        window.open(linkPreview, '_blank');
      }, 
      error: () => {
        this.toastService.Warning('Không lấy được liên kết tải về');
      },
    });
  }
  apporveProgress(progressId: string, accpect: boolean) {
    this.ModalReviewProgressRef.showModal(progressId, accpect);
  }
  getStatusLabel(statusKey: string): string {
    return (
      ConvertStatusTask[statusKey as keyof typeof ConvertStatusTask] ||
      'Chưa báo cáo'
    );
  }
  convertStatus(status: string): string {
    switch (status) {
      case 'submitted':
        return 'Chờ phê duyệt';
      case 'approved':
        return 'Đã phê duyệt';
      case 'rejected':
        return 'Đã từ chối';
      default:
        return status;
    }
  }


  accept(progressId: number) {
    this.reviewChildJobService.acceptProgress(progressId.toString()).subscribe({
      next: () => {
        this.toastService.Success('Chấp nhận báo cáo và cập nhật tiến độ thành công.');
        this.refreshData(); // reload list so status becomes 'approved'
      },
      error: (err) => {
        this.toastService.Warning(err?.message || 'Lỗi phê duyệt báo cáo !');
      },
    });
  }

  showInfo() {
    this.toastService.ForFeature();
  }


}

interface GroupedUserProgress {
  userName: string;
  userId: number;
  progresses: FlatProgressRow[];
  status: string;
}
interface FlatProgressRow {
  userName: string;
  periodIndex: number;
  periodStartDate: string;    // Thêm trường này
  periodEndDate: string; 
  scheduledDate: string;
  status: string;
  progressId: number;
  result: string | null;
  suggest: string | null;
  feedback: string | null;
  file: string | null;
  filePath: string | null;
}
