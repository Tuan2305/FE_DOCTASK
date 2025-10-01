import { ToastService } from './../../../../service/toast.service';
import { Component, HostListener, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DetailViecquanlyItemComponent } from '../../../../components/detail-viecquanly-item/detail-viecquanly-item.component';
import { SHARED_LIBS } from '../viecquanly-sharedLib';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailViecquanlyService } from '../../../../service/detail-viecquanly.service';
import { DetailViecquanlyModel } from '../../../../models/detail-viecquanly.model';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { LoadingComponent } from '../../../../components/loading/loading.component';
import { PageEmptyComponent } from '../../../../components/page-empty/page-empty.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Observable } from 'rxjs';
import { ResponsePaganation } from '../../../../interface/response-paganation';
@Component({
  selector: 'app-detail-viecquanly',
  imports: [
    ...SHARED_LIBS,
    DetailViecquanlyItemComponent,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    LoadingComponent,
    PageEmptyComponent,
  ],
  templateUrl: './detail-viecquanly.component.html',
  styleUrl: './detail-viecquanly.component.css',
})
export class DetailViecquanlyComponent {
  taskId!: number;
  openedMoreOptionId: string | null = null;
  isShowModalAssignWork = false;
  isLoading = true;
  totalItems: Number | null = null;
  textSearch = '';
  private destroyRef = inject(DestroyRef);
  data$!: Observable<ResponsePaganation<DetailViecquanlyModel>>;

  listData: DetailViecquanlyModel[] = [];
  filterListDetailViecQuanLy: DetailViecquanlyModel[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detailViecquanlyService: DetailViecquanlyService,
    private toastService: ToastService
  ) {}
  ngOnInit() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.taskId = +params['id']; // Gán taskId
        // Khởi tạo data$ sau khi có taskId
        this.data$ = this.detailViecquanlyService.onRefresh(
          this.taskId.toString(),
          this.currentPage.toString()
          
        );
        this.getData(); // Gọi getData sau khi data$ được gán
      });
  }
  onSearchChange(textSearch: string) {
    const keyword = textSearch.toLowerCase().trim();

    if (!keyword) {
      this.listData = this.filterListDetailViecQuanLy;
      return;
    }

    this.listData = this.filterListDetailViecQuanLy.filter((task) =>
      task.Title?.toLowerCase().includes(keyword)
    );
  }
  onPageChange(currentPage: number) {
    this.currentPage = currentPage;
    this.data$ = this.detailViecquanlyService.onRefresh(
      this.taskId.toString(),
      this.currentPage.toString()
    );
    this.getData();
  }
  getData() {
    this.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.isLoading = false;
          this.listData = res.items;
          this.filterListDetailViecQuanLy = res.items;
          this.totalItems = res.totalItems;
          this.pageSize = res.pageSize;
          this.currentPage = res.currentPage;
        }, 500);
      },
      error: (err) => {
        this.toastService.Warning(err.message ?? 'Lấy dữ liệu thất bại !');
        this.isLoading = false;
      },
    });
  }
  //-----

  // --------
  onToggleMoreOption(id: string) {
    this.openedMoreOptionId = this.openedMoreOptionId === id ? null : id;
  }
  @HostListener('document:click')
  closeAllMoreOptions() {
    this.openedMoreOptionId = null;
  }
  // ---------

  toggleShowAssignWork() {
    this.isShowModalAssignWork = !this.isShowModalAssignWork;
  }

  goBack() {
    this.location.back();
  }
}
