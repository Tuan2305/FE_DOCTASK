import { ToastService } from './../../service/toast.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ViecquanlyModel } from '../../models/viecquanly.model';
import { DetailProgressTaskParentModel } from '../../models/detail-progress.model';
import { DetailProgressService } from '../../service/detail-progress.service';
import { convertToVietnameseDate } from '../../helper/convertToVNDate';
import { ConvertStatusTask } from '../../constants/util';
import { NzTableModule } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-modal-detail-progress-original-job',
  imports: [FormsModule, CommonModule, NzTableModule],
  templateUrl: './modal-detail-progress-original-job.component.html',
  styleUrl: './modal-detail-progress-original-job.component.css',
})
export class ModalDetailProgressOriginalJobComponent {
  @Input() viecGoc!: ViecquanlyModel;
  @Output() isShowModal = new EventEmitter<any>();
  detailProgressTaskParentModel?: DetailProgressTaskParentModel;
  isloading = true;
  totalItems: Number | null = null;
  pageSize: number | null = null;

  constructor(
    private detailProgressService: DetailProgressService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData('1');
  }
  onPageChange(currentPage: number) {
    this.loadData(currentPage.toString());
  }
  loadData(currentPage: string) {
    this.detailProgressService
      .detailProgressTaskParent(this.viecGoc.taskId.toString(), currentPage)
      .subscribe({
        next: (data) => {
          this.totalItems = data.children.length;

          this.detailProgressTaskParentModel = data;
        },
        error: (err) => {
          this.toastService.Warning(err.message || 'Lấy dữ liệu thất bại !');
        },
      });
    this.isloading = false;
  }
  convertDateTime(datetime: string): string {
    return convertToVietnameseDate(datetime);
  }
  convertStatusText(status: string | null): string {
    return (
      ConvertStatusTask[status as keyof typeof ConvertStatusTask] ||
      'Không xác định'
    );
  }
  onClose() {
    this.isShowModal.emit(false);
  }
}
