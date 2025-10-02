import { ToastService } from './../../service/toast.service';
import { ViecQuanlyService } from './../../service/viecquanly.service';
import { Component, Input, ViewChild,OnInit,OnDestroy } from '@angular/core';
import { ViecquanlyModel } from '../../models/viecquanly.model';
import { Router } from '@angular/router';
import { ModalDetailProgressOriginalJobComponent } from '../modal-detail-progress-original-job/modal-detail-progress-original-job.component';
import { CommonModule } from '@angular/common';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { convertToVietnameseDate } from '../../helper/convertToVNDate';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ModalDetailDespcriptionJobComponent } from '../modal-detail-despcription-job/modal-detail-despcription-job.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { convertDateArrayToISOStrings } from '../../helper/converetToISODate';
import { EditMissonItemComponent } from '../edit-misson-item/edit-misson-item.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
 import { debounceTime, exhaustMap, filter, finalize, Subject, Subscription, switchMap, take, throttle, throttleTime } from 'rxjs';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-viecquanly-item',
  standalone:true,
  imports: [
    ModalDetailProgressOriginalJobComponent,
    CommonModule,
    NzProgressModule,
    NzDropDownModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    ModalDetailDespcriptionJobComponent,
    NzModalModule,
    NzDatePickerModule,
    EditMissonItemComponent,
    NzIconModule,
    NzSwitchModule,
  ],
  templateUrl: './viecquanly-item.component.html',
  styleUrl: './viecquanly-item.component.css',
})
export class ViecquanlyItemComponent {
  @ViewChild('confirmBtn', { static: false }) confirmBtn: any;

  @ViewChild(ModalDetailDespcriptionJobComponent)
  ModalDetailDespcriptionJobRef!: ModalDetailDespcriptionJobComponent;
  @Input() viecquanly!: ViecquanlyModel;
  jobname = '';
  despcriptionJob = '';
  isShowModalTienDo = false;
  isOkLoading = false;
  isEditTitleTask = true;
  isEditDespTask = true;
  isEditDateTimeTask = false;
  isAddChildTask = false;
  isVisibleModalEdit = false;
  isVisibleModalAddJob = false;
  objectEdit: ObjectEdit = {
    title: '',
    description: '',
    startDate: null,
    endDate: null,
  };
  constructor(
    private router: Router,
    private viecQuanlyService: ViecQuanlyService,
    private toastService: ToastService,
  ) {}
  private editClick$ = new Subject<void>();
  private lastEditTime: number = 0; // giữ thời gian request cuối
 
private subscription?: Subscription;


handleEditDirect() {
  console.log('Click');
  if (this.isSubmitting) {
    console.log('Đang xử lý, bỏ qua');
    return;
  }

  // Đóng modal NGAY LẬP TỨC khi bấm xác nhận
  this.isVisibleModalAddJob = false;
  this.isVisibleModalEdit = false;

  this.isSubmitting = true;
  this.isOkLoading = true;

  const object = {
    title: this.jobname,
    description: this.despcriptionJob,
    startDate: this.objectEdit.startDate
      ? convertDateArrayToISOStrings(this.objectEdit.startDate)
      : null,
    dueDate: this.objectEdit.endDate
      ? convertDateArrayToISOStrings(this.objectEdit.endDate)
      : null,
  };

  this.viecQuanlyService
    .editViecQuanly(this.viecquanly.taskId.toString(), object)
    .pipe(
      finalize(() => {
        console.log('API hoàn tất');
        this.isOkLoading = false;
        this.isSubmitting = false;
      })
    )
    .subscribe({
      next: () => {
        console.log('API thành công');
        this.toastService.Success('Cập nhật thành công !');
        this.viecQuanlyService.triggerRefresh();
      },
      error: (err) => {
        console.log('API thất bại:', err);
        this.toastService.Warning('Cập nhật thất bại !');
      },
    });
}

  closeModalAddChildJob() {
    this.isVisibleModalAddJob = false;
  }
  showModalAddChildJob() {
    this.isVisibleModalAddJob = true;
  }
  //-----    ---------
  toggleShowModalTienDo() {
    this.isShowModalTienDo = !this.isShowModalTienDo;
  }
  closeModalTienDo(isShow: boolean) {
    this.isShowModalTienDo = isShow;
  }

  convertDate(date: string): string {
    return convertToVietnameseDate(date);
  }
  onChange(result: Date): void {
    const dates = result.toString().split(',');
    this.objectEdit.startDate = dates[0];
    this.objectEdit.endDate = dates[1];
  }
  //-----    ---------

  showModalEdit(): void {
    this.isVisibleModalEdit = true;
    this.jobname = '';
    this.despcriptionJob = '';
  }

 isSubmitting = false;


// handleEditDirect(event: MouseEvent): void {
//   // Chặn ngay từ lần đầu
//   const btn = this.confirmBtn?.nativeElement as HTMLButtonElement;
//   if (btn.disabled) {
//     return; // nếu đã disable thì bỏ qua
//   }
//   btn.disabled = true; // disable trực tiếp DOM ngay lập tức

//   this.isOkLoading = true;

//   const object = {
//     title: this.jobname,
//     description: this.despcriptionJob,
//     startDate: this.objectEdit.startDate
//       ? convertDateArrayToISOStrings(this.objectEdit.startDate)
//       : null,
//     dueDate: this.objectEdit.endDate
//       ? convertDateArrayToISOStrings(this.objectEdit.endDate)
//       : null,
//   };

//   this.viecQuanlyService
//     .editViecQuanly(this.viecquanly.taskId.toString(), object)
//     .pipe(
//       finalize(() => {
//         this.isOkLoading = false;
//         btn.disabled = false; // mở lại sau khi API xong
//       })
//     )
//     .subscribe({
//       next: () => {
//         this.toastService.Success('Cập nhật thành công !');
//         this.viecQuanlyService.triggerRefresh();
//         this.isVisibleModalEdit = false;
//       },
//       error: () => {
//         this.toastService.Warning('Cập nhật thất bại !');
//       },
//     });
// }





  handleCancel(): void {
    this.isVisibleModalEdit = false;
  }
  showModalDesp() {
    this.ModalDetailDespcriptionJobRef.showModal();
  }
  navigateToReview() {
    this.router.navigate(['/viecquanly/review', this.viecquanly.taskId]);
  }
  navigateToDetail() {
    this.router.navigate(['/viecquanly/chitiet', this.viecquanly.taskId]);
  }
  refreshDataPage() {}
}
export interface ObjectEdit {
  title: string | null;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}
