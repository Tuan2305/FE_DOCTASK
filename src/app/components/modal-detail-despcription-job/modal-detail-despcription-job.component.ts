import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-detail-despcription-job',
  imports: [CommonModule, NzModalModule],
  templateUrl: './modal-detail-despcription-job.component.html',
  styleUrl: './modal-detail-despcription-job.component.css',
})
export class ModalDetailDespcriptionJobComponent {
  @Input() desp!: string;
  isVisible = false;
  handleCancel(): void {
    this.isVisible = false;
  }
  showModal(): void {
    this.isVisible = true;
  }
}
