import { AssignWorkService } from './../../service/assign-work.service';
import { ToastService } from './../../service/toast.service';
import { ListAssignWorkService } from '../../service/list-assign-work.service';
import { TaskViewModel } from '../../models/task-view.model';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalAssignScheduleComponent } from '../modal-assign-schedule/modal-assign-schedule.component';
import { ModalDateTimePicker } from '../modal-date-time-picker/modal-date-time-picker.component';
import { ModalAssignPersonToJobComponent } from '../modal-assign-person-to-job/modal-assign-person-to-job.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FrequencyView } from '../../models/frequency-view.model';
import { AssignResult } from '../../models/assign-result.model';
import { convertToVietnameseDate } from '../../helper/convertToVNDate';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { convertDateArrayToISOStrings } from '../../helper/converetToISODate';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
@Component({
  selector: 'edit-app-misson-item',
  imports: [
    CommonModule,
    FormsModule,
    ModalAssignScheduleComponent,
    ModalAssignPersonToJobComponent,
    NzButtonModule,
    NzDatePickerModule,
    NzInputModule,
    NzPopconfirmModule,
    NzPopoverModule,
  ],
  templateUrl: './edit-misson-item.component.html',
  styleUrl: './edit-misson-item.component.css',
})
export class EditMissonItemComponent implements OnInit {
  @Input() taskIdParent!: number;
  @Output() removetask = new EventEmitter<number>();
  @Output() refreshData = new EventEmitter<void>();
  @Output() closeEdit = new EventEmitter<any>();
  @ViewChild(ModalDateTimePicker)
  modalDateTimePickerRef!: ModalDateTimePicker;
  visiblePopoverConfirmGiaoViec = false;
  visiblePopoverConfirmHuyGiaoViec = false;
  jobName: string = '';

  task: TaskViewModel = {
    id: Date.now(),
    title: '',
    description: '',
    assigneeIds: [],
    assigneeFullNames: [],
    unitIds: [],
    startDate: null,
    endDate: null,
    frequencyType: null,
    intervalValue: null,
    daysOfWeek: [],
    daysOfMonth: [],
    parentTaskId: null,
  };
  constructor(
    private modal: NzModalService,
    private listAssignWorkService: ListAssignWorkService,
    private toastService: ToastService,
    private assignWorkService: AssignWorkService
  ) {}
  ngOnInit(): void {}
  //----- datetime picker --------

  onChange(result: Date): void {
    const dates = result.toString().split(',');
    this.task.startDate = dates[0];
    this.task.endDate = dates[1];
  }

  //----- assign person to work popup ------
  getAssigned(data: AssignResult) {
    // Reset trước
    this.task.assigneeIds = [];
    this.task.assigneeFullNames = [];
    this.task.unitIds = [];

    // Gán người dùng nếu có
    if (data.users.length > 0) {
      this.task.assigneeIds = data.users.map((u) => u.userId);
      this.task.assigneeFullNames = data.users.map((u) => u.fullName);
    }

    // Gán đơn vị nếu có
    if (data.units.length > 0) {
      this.task.unitIds = data.units.map((u) => u.unitId);
      // Gộp với tên user nếu cần, hoặc thay thế nếu bạn muốn
      this.task.assigneeFullNames = this.task.assigneeFullNames.concat(
        data.units.map((u) => u.unitName)
      );
      // Nếu đơn vị không dùng `assigneeIds`, có thể bỏ gán lại dòng này
    }
    // console.log(this.task.assigneeFullNames);
  }
  //----- assign tags popup ------

  getFrequencySelected(data: FrequencyView) {
    this.task.frequencyType = data.frequency_type;
    this.task.intervalValue = data.interval_value;
    this.task.daysOfMonth = data.daysInMonth;
    this.task.daysOfWeek = data.daysInWeek;
  }
  getContentTask(data: string) {
    this.task.description = data;
  }

  // ------

  confirmGiaoViec(): void {
    if (!this.jobName || this.jobName.trim() === '') {
      this.toastService.Warning('Vui lòng điền tên công việc!');

      return;
    }

    if (!this.task.assigneeIds || !this.task.unitIds) {
      this.toastService.Warning('Vui lòng phân công công việc!');

      return;
    }

    if (!this.task.startDate || !this.task.endDate) {
      this.toastService.Warning('Vui lòng chọn thời hạn công việc!');

      return;
    }

    if (!this.task.frequencyType) {
      this.toastService.Warning('Vui lòng chọn kỳ báo cáo công việc!');

      return;
    }
    const objectTaskChild = {
      title: this.jobName,
      description: this.task.description,
      assigneeIds: this.task.assigneeIds,
      unitIds: this.task.unitIds,
      startDate: convertDateArrayToISOStrings(this.task.startDate ?? ''),
      endDate: convertDateArrayToISOStrings(this.task.endDate ?? ''),
      frequencyType: this.task.frequencyType,
      intervalValue: this.task.intervalValue,
      daysOfWeek: this.task.daysOfWeek,
      daysOfMonth: this.task.daysOfMonth,
      parentTaskId: this.taskIdParent,
    };
    this.assignWorkService.CreateChildTask(objectTaskChild).subscribe({
      next: (respone) => {
        const newTask: TaskViewModel = {
          ...this.task,
          id: respone.taskId,
          parentTaskId: this.taskIdParent,
          title: this.jobName,
        };

        this.listAssignWorkService.addTask(newTask);
        this.toastService.Success('Giao việc thành công!');
        this.closeAddJob();
        this.refreshData.emit();
      },
      error: (err) => {
        this.closeAddJob();

        this.toastService.Warning(err.message ?? 'Giao việc thất bại !');
      },
    });
  }
  onCancelConfirmGiaoViec() {
    this.visiblePopoverConfirmGiaoViec = false;
  }
  confirmHuyGiaoViec(): void {
    this.closeAddJob();
  }
  onCancelConfirmHuyGiaoViec() {
    this.visiblePopoverConfirmHuyGiaoViec = false;
  }

  closeAddJob() {
    this.closeEdit.emit();
    this.task = {
      id: Date.now(),
      title: '',
      description: '',
      assigneeIds: [],
      unitIds: [],
      assigneeFullNames: [],
      startDate: null,
      endDate: null,
      frequencyType: null,
      intervalValue: null,
      daysOfWeek: [],
      daysOfMonth: [],
      parentTaskId: null,
    };
  }
  hadleAddJob(taskId: number) {
    const newTask: TaskViewModel = {
      ...this.task,
    };

    // this.listAssignWorkService.addTask(newTask);
  }
  convertDateTimeVn(datetime: string): string {
    return convertToVietnameseDate(datetime);
  }
}
