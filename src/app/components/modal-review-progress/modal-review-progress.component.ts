import { SendRemindService } from './../../service/send-remind.service';
import { Component } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ToastService } from '../../service/toast.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReviewChildJobService } from '../../service/review-child-job.service';
@Component({
  selector: 'app-modal-review-progress',
  imports: [
    NzModalModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './modal-review-progress.component.html',
  styleUrl: './modal-review-progress.component.css',
})
export class ModalReviewProgressComponent {
  userSelectedId: string | null = null;
  messageValue: string = '';
  isVisible = false;
  isOkLoading = false;
  accpectProgress = false;
  constructor(
    private toastService: ToastService,
    private reviewChildJobService: ReviewChildJobService
  ) {}
  showModal(id: string | null, accpectProgress: boolean): void {
    this.accpectProgress = accpectProgress;
    this.userSelectedId = id;
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    if (!this.userSelectedId) {
      this.toastService.Warning('Lỗi không có người nhắc nhở !');
      return;
    }
    setTimeout(() => {
      this.isOkLoading = true;
      const obj = {
        progressId: this.userSelectedId,
        status: this.accpectProgress ? 'approved' : 'rejected',
        comment: this.messageValue,
      };
      this.reviewChildJobService.approveProgress(obj).subscribe({
        next: () => {
          this.accpectProgress
            ? this.toastService.Success('Phê duyệt báo cáo thành công !')
            : this.toastService.Success('Từ chối báo cáo thành công !');
        },
        error: () => {
          this.accpectProgress
            ? this.toastService.Warning('Lỗi phê duyệt báo cáo !')
            : this.toastService.Warning('Lỗi từ chối báo cáo !');
        },
      });
      this.isOkLoading = false;

      // console.log('send user');

      this.isVisible = false;
      this.isOkLoading = false;
      return;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
