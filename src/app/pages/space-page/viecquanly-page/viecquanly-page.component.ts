import { ToastService } from './../../../service/toast.service';
import { ViecquanlyItemComponent } from './../../../components/viecquanly-item/viecquanly-item.component';
import { Component, inject, OnInit, DestroyRef } from '@angular/core';

import { LoadingComponent } from '../../../components/loading/loading.component';
import { PageEmptyComponent } from '../../../components/page-empty/page-empty.component';
import { ViecQuanlyService } from '../../../service/viecquanly.service';
import { ViecquanlyModel } from '../../../models/viecquanly.model';
import { SHARED_LIBS } from './viecquanly-sharedLib';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Observable, Subject } from 'rxjs';
import { ResponsePaganation } from '../../../interface/response-paganation';
@Component({
  selector: 'app-viecquanly-page',
  standalone:true,
  imports: [
    ...SHARED_LIBS,
    LoadingComponent,
    PageEmptyComponent,
    ViecquanlyItemComponent,
    NzPaginationModule,
    NzIconModule,
    NzInputModule,
  ],
  templateUrl: './viecquanly-page.component.html',
  styleUrl: './viecquanly-page.component.css',
})
export class ViecquanlyPageComponent implements OnInit {
  isLoading = true;
  listViecquanly: ViecquanlyModel[] = [];
  totalItems: number | null = null;
  pageSize: number | null = null;
  currentPage: number = 1;
  textSearch = '';
  filterListViecQuanLy: ViecquanlyModel[] = [];
  private destroyRef = inject(DestroyRef);
  data$!: Observable<ResponsePaganation<ViecquanlyModel>>;
  constructor(
    private toastService: ToastService,
    private viecQuanlyService: ViecQuanlyService
  ) {}

  ngOnInit(): void {
    this.data$ = this.viecQuanlyService.onRefresh(this.currentPage.toString());
    this.getData();
  }
  onSearchChange(textSearch: string) {
    const keyword = textSearch.toLowerCase().trim();

    if (!keyword) {
      this.listViecquanly = this.filterListViecQuanLy;
      return;
    }

    this.listViecquanly = this.filterListViecQuanLy.filter((task) =>
      task.title?.toLowerCase().includes(keyword)
    );
  }
  onPageChange(currentPage: number) {
    this.currentPage = currentPage; 
    this.data$ = this.viecQuanlyService.onRefresh(this.currentPage.toString());
      this.getData();
  }

  getData() {
    this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isLoading = false;
          this.listViecquanly = res.items;
          this.filterListViecQuanLy = res.items;
          this.totalItems = res.totalItems;
         this.pageSize =res.pageSize;
         this.currentPage = res.currentPage;


        }, 500);
      },
      error: (err) => {
        this.toastService.Warning(err.message ?? 'Lấy dữ liệu thất bại !');
        this.isLoading = false;
      },
    });
  }
}
