import { AuthService } from './../../service/auth.service';
import { ToastService } from './../../service/toast.service';
import { StorageService } from './../../service/storage.service';
import { Component } from '@angular/core';
import { SHARED_LIBS } from '../main-sharedLib';

import { ModalSummarizeReportsComponent } from '../../components/modal-summarize-reports/modal-summarize-reports.component';
import { NzModalRef, NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NotificationComponent } from '../../components/notification/notification.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    ...SHARED_LIBS,

    NzModalModule,
    NzDropDownModule,
    NotificationComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isShowModalReviewAllJob = false;
  isShowModalAssignWork = false;
  currentRoute: string = '';
  username!: string;
  email!: string;
  constructor(
    private toastService: ToastService,
    private modal: NzModalService,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {
    // Theo dõi thay đổi route
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

    ngOnInit() {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.email = profile.email;
        this.username = profile.username;
      },
      error: () => {
        this.email = '';
        this.username = '';
      },
    });
  }
  // ------ show toast ---------

  showInfo() {
    this.toastService.Info('Tính năng này đang phát triển');
  }

  // ---- modal review all job -----
  toggleShowReviewAllJob() {
    this.isShowModalReviewAllJob = !this.isShowModalReviewAllJob;
  }
  // // ---- modal assign work -----
  // toggleShowAssignWork() {
  //   this.isShowModalAssignWork = !this.isShowModalAssignWork;
  // }

  get isAssignWorkPage(): boolean {
    return this.currentRoute.includes('/assignWork');
  }

  showModalSumaryReport(): void {
    const modal: NzModalRef = this.modal.create({
      nzTitle: 'Tổng hợp báo cáo',
      nzContent: ModalSummarizeReportsComponent,
      nzFooter: [
        {
          label: 'Hủy bỏ',
          shape: 'round',
          onClick: () => modal.destroy(),
        },
      ],
    });
  }
  logout() {
    this.authService.logout();
  }
  //----------
  ngOnDestroy() {}
}
