import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../components/toast/toast.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SHARED_LIBS } from './main-sharedLib';
import { NzResultModule } from 'ng-zorro-antd/result';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    ...SHARED_LIBS,
    ToastComponent,
    HeaderComponent,
    SidebarComponent,
    NzResultModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  isMobile: boolean = false;
  constructor() {}
  ngOnInit(): void {
    this.isMobile =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
      ) || window.innerWidth < 100;
  }
}
