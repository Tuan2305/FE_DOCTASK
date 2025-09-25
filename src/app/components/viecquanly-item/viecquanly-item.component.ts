import { ToastService } from './../../service/toast.service';
import { ViecQuanlyService } from './../../service/viecquanly.service';
import { Component, Input, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-viecquanly-item',
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
    private toastService: ToastService
  ) {}
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

  handleEdit(): void {
    if (this.jobname == '' && this.isEditTitleTask) {
      this.toastService.Warning('Vui lòng nhập tên công việc !');
      return;
    }
    if (this.despcriptionJob == '' && this.isEditDespTask) {
      this.toastService.Warning('Vui lòng nhập nội dung công việc !');
      return;
    }
    if (
      this.objectEdit.startDate == null &&
      this.objectEdit.startDate == null &&
      this.isEditDateTimeTask
    ) {
      this.toastService.Warning('Vui lòng nhập chọn thời hạn công việc !');
      return;
    }
    const object = {
      title: this.jobname,
      description: this.despcriptionJob,
      startDate:
        this.objectEdit.startDate == null
          ? null
          : convertDateArrayToISOStrings(this.objectEdit.startDate),
      dueDate:
        this.objectEdit.endDate == null
          ? null
          : convertDateArrayToISOStrings(this.objectEdit.endDate),
    };
    this.isOkLoading = true;
    this.viecQuanlyService
      .editViecQuanly(this.viecquanly.taskId.toString(), object)
      .subscribe({
        next: () => {
          this.toastService.Success('Cập nhật thành công !');
          this.viecQuanlyService.triggerRefresh();
        },
        error: () => {
          this.toastService.Warning('Cập nhật thất bại !');
        },
      });
    this.isOkLoading = false;

    this.isVisibleModalEdit = false;
  }

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
