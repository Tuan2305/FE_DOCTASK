import { take } from 'rxjs/operators';
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
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TaskViewModel } from '../../models/task-view.model';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ToastService } from '../../service/toast.service';
import { ModalDateTimePicker } from '../modal-date-time-picker/modal-date-time-picker.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { convertDateArrayToISOStrings } from '../../helper/converetToISODate';
import { AssignWorkService } from '../../service/assign-work.service';
@Component({
  selector: 'app-modal-add-job',
  imports: [
    NzModalModule,
    CommonModule,
    NzButtonModule,
    NzSwitchModule,
    FormsModule,
    NzSpinModule,
    NzSelectModule,
    NzInputModule,
    NzDatePickerModule,
  ],
  templateUrl: './modal-add-job.component.html',
  styleUrl: './modal-add-job.component.css',
})
export class ModalAddJobComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;

  jobName: string = '';
  description: string = '';
  selectedMisson: any;
  @Input() listTask: TaskViewModel[] = [];
  @Output() jobAdded = new EventEmitter<any>();
  @ViewChild(ModalDateTimePicker)
  modalDateTimePickerRef!: ModalDateTimePicker;
  task: TaskViewModel = {
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
  constructor(
    private toastService: ToastService,
    private assignWorkService: AssignWorkService
  ) {}
  ngOnInit(): void {
    // console.log(this.listTask);
  }
  onChange(result: Date): void {
    const dates = result.toString().split(',');
    this.task.startDate = dates[0];
    this.task.endDate = dates[1];
  }
  showModal(): void {
    this.isVisible = true;
    this.jobName = '';
    this.description = '';
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    if (this.jobName == '') {
      this.isConfirmLoading = false;

      this.toastService.Warning('Vui lòng nhập tên công việc !');
      return;
    }
    if (this.description == '') {
      this.isConfirmLoading = false;

      this.toastService.Warning('Vui lòng nhập nội dung công việc !');
      return;
    }
    if (this.task.startDate == null && this.task.endDate == null) {
      this.isConfirmLoading = false;

      this.toastService.Warning('Vui lòng nhập thời hạn !');
      return;
    }
    setTimeout(() => {
  const objectTaskParent = {
    title: this.jobName,
    description: this.description,
    startDate: new Date(this.task.startDate as string).toISOString(),
    dueDate: new Date(this.task.endDate as string).toISOString(),
  };
  this.assignWorkService.CreateParentTask(objectTaskParent).subscribe({
    next: (data) => {
      const newTask: TaskViewModel = {
        ...this.task,
        id: data.taskId,
        title: this.jobName,
        description: this.description,
      };
      this.jobAdded.emit(newTask);
      this.toastService.Success('Giao việc thành công!');
    },
    error: (err) => {
      this.toastService.Warning(err.message ?? 'Giao việc thất bại !');
    },
  });

  this.isConfirmLoading = false;
  this.isVisible = false;
}, 500);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
