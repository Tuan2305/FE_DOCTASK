import { AssignWorkService } from './../../service/assign-work.service';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MissonItemComponent } from '../../components/misson-item/misson-item.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ToastService } from '../../service/toast.service';
import { ModalAddJobComponent } from '../../components/modal-add-job/modal-add-job.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { TaskViewModel } from '../../models/task-view.model';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { FormsModule } from '@angular/forms';
import { ListAssignWorkService } from '../../service/list-assign-work.service';
import { ModalDateTimePicker } from '../../components/modal-date-time-picker/modal-date-time-picker.component';
import { EditMissonItemComponent } from '../../components/edit-misson-item/edit-misson-item.component';

@Component({
  selector: 'app-assign-work-page',
  templateUrl: './assign-work-page.component.html',
  styleUrl: './assign-work-page.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MissonItemComponent,
    NzModalModule,
    ModalAddJobComponent,
    NzButtonModule,
    NzIconModule,
    NzUploadModule,
    NzCollapseModule,
    FormsModule,
    EditMissonItemComponent,
  ],
})
export class AssignWorkPageComponent implements OnInit {
  @ViewChild(ModalAddJobComponent)
  ModalAddJobComponentRef!: ModalAddJobComponent;
  @ViewChild(ModalDateTimePicker)
  modalDateTimePickerRef!: ModalDateTimePicker;
  taskList: TaskViewModel[] = [];
  isShowDateTimePicker = false;
  isShowAddJob = false;
  uploadedFileName: string | null = null;
  expandedGroups: boolean[] = [];
  fileList: NzUploadFile[] = [];
  constructor(
    private modal: NzModalService,
    private toastService: ToastService,
    private locationRoute: Location,
    private listAssignWorkService: ListAssignWorkService,
    private assignWorkService: AssignWorkService
  ) {}

  ngOnInit(): void {
    this.listAssignWorkService.taskList$.subscribe((tasks) => {
      this.taskList = tasks;
    });
  }
  showAddJob() {
    this.isShowAddJob = true;
  }
  closeAddJob() {
    this.isShowAddJob = false;
  }
  showModalAddJob(): void {
    this.ModalAddJobComponentRef.showModal();
    // this.handleJobAdded(newTask)
  }

  get parentTasks(): TaskViewModel[] {
    return this.taskList.filter((t) => t.parentTaskId === null);
  }
  getChildTasks(parentId: number): TaskViewModel[] {
    return this.taskList.filter((task) => task.parentTaskId === parentId);
  }
  removeTask(id: number) {
    this.listAssignWorkService.removeTaskWithChildren(id);

    // console.log(this.taskList);
  }

  // Hàm phụ lấy toàn bộ id của task con lồng nhau
  getAllNestedTaskIds(parentId: number): number[] {
    const toRemove: number[] = [parentId];

    const findChildren = (pid: number) => {
      const children = this.taskList.filter((t) => t.parentTaskId === pid);
      for (const child of children) {
        toRemove.push(child.id);
      }
    };

    findChildren(parentId);
    return toRemove;
  }
  showConfirm(): void {
    if (!this.listAssignWorkService.areAllTasksValid()) {
      this.toastService.Warning('Vui lòng điền đầy đủ các trường!');
      return;
    }
    this.modal.confirm({
      nzTitle: '<i>Bạn chắc chắn hoàn thành giao việc?</i>',
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => {
        const listTaskParent: TaskViewModel[] = this.parentTasks;
        listTaskParent.forEach((parentTask) => {
          const objectTaskParent = {
            title: parentTask.title,
            description: parentTask.description,
            priority: '',
          };
          this.assignWorkService.CreateParentTask(objectTaskParent).subscribe({
            next: (resTaskParent) => {
              const taskChild = this.getChildTasks(parentTask.id);
              taskChild.forEach((child) => {
                const objectTaskChild = {
                  title: child.title,
                  description: child.description,
                  assigneeIds: child.assigneeIds,
                  unitIds: child.unitIds,
                  startDate: child.startDate,
                  endDate: child.endDate,
                  frequencyType: child.frequencyType,
                  intervalValue: child.intervalValue,
                  daysOfWeek: child.daysOfWeek,
                  daysOfMonth: child.daysOfMonth,
                  parentTaskId: resTaskParent.taskId,
                };

                this.assignWorkService
                  .CreateChildTask(objectTaskChild)
                  .subscribe({
                    next: () => {
                      this.toastService.Success('Giao việc thành công!');
                    },
                    error: (err) => {
                      this.toastService.Warning(
                        err.message ?? 'Giao việc thất bại !'
                      );
                    },
                  });
              });
            },
            error: (err) => {
              this.toastService.Warning(err.message ?? 'Giao việc thất bại !');
            },
          });
        });
      },
      nzOkText: 'Xác nhận',
      nzCancelText: 'Hủy bỏ',
    });
  }
  showConfirmDelete(id: number): void {
    this.modal.confirm({
      nzTitle: '<i>Bạn chắc chắn muốn xóa ?</i>',
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.removeTask(id),

      nzOkText: 'Xác nhận',
      nzCancelText: 'Hủy bỏ',
    });
  }

  cancelAssign(): void {
    this.modal.confirm({
      nzTitle: '<i>Bạn chắc chắn chứ ?</i>',
      nzContent: 'Dữ liệu giao việc hiện tại sẽ mất !',
      nzOnOk: () => {
        this.locationRoute.back();
      },
      nzOkText: 'Xác nhận',
      nzCancelText: 'Hủy bỏ',
    });
  }

  handleJobAdded(task: TaskViewModel) {
    this.listAssignWorkService.addTask(task);
  }
}
