import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ViecduocgiaoService } from '../../../service/viecduocgiao.service';
import { ViecduocgiaoModel } from '../../../models/viecduocgiao.model';
import { SHARED_LIBS } from './viecduocgiao-sharedLib';
import { PageEmptyComponent } from '../../../components/page-empty/page-empty.component';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { ViecduocgiaoItemComponent } from '../../../components/viecduocgiao-item/viecduocgiao-item.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '../../../service/toast.service';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { convertToVietnameseDate } from '../../../helper/convertToVNDate';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
@Component({
  selector: 'app-viecduocgiao-page',
  imports: [
    ...SHARED_LIBS,
    PageEmptyComponent,
    LoadingComponent,
    ViecduocgiaoItemComponent,
    NzPaginationModule,
    NzIconModule,
    NzInputModule,
  ],
  templateUrl: './viecduocgiao-page.component.html',
  styleUrl: './viecduocgiao-page.component.css',
})
export class ViecduocgiaoPageComponent implements OnInit {
  taskId: number | null = null;
  isLoading = true;
  listViecdagiao: ViecduocgiaoModel[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  textSearch = '';
  filterListViecDuocGiao: ViecduocgiaoModel[] = [];
  highlightedId: string | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private viecduocgiaoService: ViecduocgiaoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getData('1');

    this.route.queryParams.subscribe((params) => {
      const highlightId = params['highlightId'];
      if (highlightId) {
        this.highlightItem(highlightId);
      }
    });

    // console.log(this.highlightedId);
  }
  highlightItem(id: string) {
    this.highlightedId = id;

    // Scroll đến item có id tương ứng
    const element = document.getElementById('item-' + id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Bỏ highlight sau 3 giây nếu cần
    setTimeout(() => {
      this.highlightedId = null;
      this.location.replaceState('/viecduocgiao');
    }, 3000);
  }
  navigateToDetail(id: number) {
    this.router.navigate(['chitiet', id], { relativeTo: this.route });
  }
  onSearchChange(textSearch: string) {
    const keyword = textSearch.toLowerCase().trim();

    if (!keyword) {
      this.listViecdagiao = this.filterListViecDuocGiao;
      return;
    }

    this.listViecdagiao = this.filterListViecDuocGiao.filter((task) =>
      task.title?.toLowerCase().includes(keyword)
    );
  }

  //----- convert ----

  convertDate(time: string): string {
    return convertToVietnameseDate(time);
  }

  onPageChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getData(currentPage.toString());
  }
  getData(currentPage: string) {
    this.viecduocgiaoService
      .getAllData(currentPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          setTimeout(() => {
            this.isLoading = false;
            this.listViecdagiao = res.items;
            this.filterListViecDuocGiao = res.items;
            this.currentPage = res.currentPage;
            this.pageSize = res.pageSize;
            this.totalItems = res.totalItems;
          }, 500);
        },
        error: (err) => {
          this.toastService.Warning(err.message || 'Lấy dữ liệu thất bại !');
          this.isLoading = false;
        },
      });
  }
}