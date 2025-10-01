import { DetailViecquanlyService } from './../../service/detail-viecquanly.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ToastService } from '../../service/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDetailProgressChildJobComponent } from '../modal-detail-progress-child-job/modal-detail-progress-child-job.component';
import { DetailViecquanlyModel } from '../../models/detail-viecquanly.model';
import { convertToVietnameseDate } from '../../helper/convertToVNDate';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { FrequencyView } from '../../models/frequency-view.model';
import { FrequencyTypeMap } from '../../constants/util';
import { SelectRepeatScheduleComponent } from '../select-repeat-schedule/select-repeat-schedule.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { ModalDetailDespcriptionJobComponent } from '../modal-detail-despcription-job/modal-detail-despcription-job.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { convertDateArrayToISOStrings } from '../../helper/converetToISODate';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ModalAssignScheduleComponent } from '../modal-assign-schedule/modal-assign-schedule.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-detail-viecquanly-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    ModalDetailProgressChildJobComponent,
    NzDropDownModule,
    NzPopoverModule,
    SelectRepeatScheduleComponent,
    NzInputModule,
    NzProgressModule,
    ModalDetailDespcriptionJobComponent,
    NzModalModule,
    NzDatePickerModule,
    ModalAssignScheduleComponent,
    NzSwitchModule,
    NzIconModule,
  ],
  templateUrl: './detail-viecquanly-item.component.html',
  styleUrl: './detail-viecquanly-item.component.css',
})
export class DetailViecquanlyItemComponent implements OnInit {
  @ViewChild(ModalDetailDespcriptionJobComponent)
  ModalDetailDespcriptionJobRef!: ModalDetailDespcriptionJobComponent;
  @Input() detailViecquanlyModel!: DetailViecquanlyModel;
  @Input() openedMoreOptionId: string | null = null;
  @Output() toggleMoreOption = new EventEmitter<string>();
  isShowReviewModal = false;
  isShowDetailProgressModal = false;
  isVisibleModalEdit = false;

  isOkLoading = false;
  selectedDateRange: { start: Date | null; end: Date | null } | null = null;
  selectedRange: Date[] | null = null;
  frequency?: FrequencyView | null = null;
  objectEdit: ObjectEdit = {
    title: '',
    despcription: '',
    frequencyType: '',
    intervalValue: 0,
    daysOfWeek: [],
    daysOfMonth: [],
    startDate: '',
    dueDate: '',
  };
  // ----
  isEditTitleTask = true;
  isEditDespTask = true;
  isEditDateTimeTask = false;
  isEditFrequencyTask = false;
  constructor(
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private detailViecquanlyService: DetailViecquanlyService
  ) {}
  ngOnInit(): void {
    this.objectEdit.despcription = this.detailViecquanlyModel.Description;
    if(this.detailViecquanlyModel.StartDate && this.detailViecquanlyModel.DueDate) {
      this.selectedDateRange = {
        start: new Date(this.detailViecquanlyModel.StartDate),
        end: new Date(this.detailViecquanlyModel.DueDate)
      };
    }
    if (this.detailViecquanlyModel.FrequencyType != null) {
      this.frequency = {
        frequency_type:
          FrequencyTypeMap[
            this.detailViecquanlyModel.FrequencyType as
              | 'daily'
              | 'weekly'
              | 'monthly'
          ],
        interval_value: this.detailViecquanlyModel.IntervalValue,
        daysInWeek: this.detailViecquanlyModel.dayOfWeek ?? [],
        daysInMonth: this.detailViecquanlyModel.dayOfMonth ?? [],
      };
    }
  }

  //---- review modal ------
  goReviewPage() {
    this.router.navigate(['review', this.detailViecquanlyModel.TaskId], {
      relativeTo: this.route,
    });
  }
  //----- convert ----
  convertDate(time: string): string {
    return convertToVietnameseDate(time);
  }
  //---- detail progress child job -----
  toggleShowDetailProgressModal() {
    this.isShowDetailProgressModal = !this.isShowDetailProgressModal;
    this.openedMoreOptionId = null;
  }
  showModalDesp() {
    this.ModalDetailDespcriptionJobRef.showModal();
  }
  showInfo() {
    this.toastService.Warning('Bạn có chắc muốn xóa công việc này ?');
    this.detailViecquanlyService.deleteSubtask(this.detailViecquanlyModel.TaskId.toString()).subscribe({
      next: () => {
        this.toastService.Success('Xóa công việc thành công !');
        this.detailViecquanlyService.triggerRefresh();
      },
      error: () => {
        this.toastService.Warning('Xóa công việc thất bại !');
      }
    });
  }
  //----
  onChangeDateModalEdit(result: Date[] | null): void {
    if (!result || result.length < 2 ) {
      return;
    }
      const [start, end] = result;
      this.detailViecquanlyModel.StartDate = start?.toISOString();
      this.detailViecquanlyModel.DueDate = end.toISOString();
    }
  

  getFrequencySelected(data: FrequencyView) {
    this.objectEdit.frequencyType = data.frequency_type;
    this.objectEdit.intervalValue = data.interval_value;
    this.objectEdit.daysOfMonth = data.daysInMonth;
    this.objectEdit.daysOfWeek = data.daysInWeek;
  }
  showModalEdit(): void {
    this.isVisibleModalEdit = true;
  }

  handleEdit(): void {
    if (this.objectEdit.title == '' && this.isEditTitleTask) {
      this.toastService.Warning('Vui lòng nhập tên công việc !');
      return;
    }
    if (this.objectEdit.despcription == '' && this.isEditDespTask) {
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
      ...this.objectEdit,
      startDate: convertDateArrayToISOStrings(
        this.detailViecquanlyModel.StartDate
      ),
      dueDate: convertDateArrayToISOStrings(this.detailViecquanlyModel.DueDate),
    };
    // console.log(object);
    this.isOkLoading = true;
    this.detailViecquanlyService
      .editDetailViecQuanly(
        this.detailViecquanlyModel.TaskId.toString(),
        object
      )
      .subscribe({
        next: () => {
          this.toastService.Success('Cập nhật thành công !');
          this.detailViecquanlyService.triggerRefresh();
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
}

export interface ObjectEdit {
  title: string;
  despcription: string;
  frequencyType: string;
  intervalValue: number;
  daysOfWeek: number[];
  daysOfMonth: number[];
  startDate: string;
  dueDate: string;
}
