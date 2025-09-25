import { DetailViecquanlyService } from './../../../../service/detail-viecquanly.service';
import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SHARED_LIBS } from '../viecduocgiao-sharedLib';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ModalUpdateProgressComponent } from '../../../../components/modal-update-progress/modal-update-progress.component';
@Component({
  selector: 'app-detail-viecdagiao',
  imports: [...SHARED_LIBS, ModalUpdateProgressComponent],
  templateUrl: './detail-viecduocgiao.component.html',
  styleUrl: './detail-viecduocgiao.component.css',
})
export class DetailViecduocgiaoComponent implements OnInit {
  taskId!: number;
  isOpenPopup = false;
  isOpen1 = true;
  isOpen2 = true;
  despcription = '';
  private destroyRef = inject(DestroyRef);
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private detailViecquanlyService: DetailViecquanlyService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.taskId = params['id'];
      });
    this.despcription = history.state.description;
  }
  //------

  //----- toogle --------

  toggleContent1() {
    this.isOpen1 = !this.isOpen1;
  }
  toggleContent2() {
    this.isOpen2 = !this.isOpen2;
  }
  togglePopup() {
    this.isOpenPopup = !this.isOpenPopup;
  }

  onchildChangedShowPopup(isShow: boolean) {
    this.isOpenPopup = isShow;
  }

  goBack() {
    this.location.back();
  }
}
