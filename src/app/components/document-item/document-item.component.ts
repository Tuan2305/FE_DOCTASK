import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

import { DocumentService } from '../../service/document.service';
import { DocumentModel } from '../../models/document.model';
import { ToastService } from '../../service/toast.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-file-item',
  imports: [CommonModule, NzModalModule, NzDropDownModule, NzIconModule],
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.css',
})
export class FileItemComponent {
  @Input() doc!: DocumentModel;

  isShowModalAssignWork = false;

  constructor(
    private toastService: ToastService,
    private documentService: DocumentService,
    private modal: NzModalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {}

  //---- function ----
  deleteFile(id: number) {
    this.documentService.deleteDoc(id.toString()).subscribe({
      next: () => {
        this.toastService.Success('Xóa tài liệu thành công !');
        this.documentService.triggerRefresh();
      },
      error: (err) => this.toastService.Error('Xóa tài liệu thất bại !'),
    });
  }

  //----- convert ----
  convertDate(uploadedAt: string): string {
    const date = new Date(uploadedAt);
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  }

  toggleShowAssignWork() {
    this.isShowModalAssignWork = !this.isShowModalAssignWork;
  }

  showConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: '<i>Bạn chắc chắn hoàn thành giao việc?</i>',
      // nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => this.deleteFile(id),
    });
  }

  navigateTo() {
    // console.log(this.doc.fileName);
    // this.router.navigate(['assignJob'], {
    //   relativeTo: this.route,
    //   state: {
    //     title: this.doc.fileName,
    //   },
    // });
  }
}
