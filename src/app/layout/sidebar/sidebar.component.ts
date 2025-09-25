import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastService } from '../../service/toast.service';
import { SHARED_LIBS } from '../main-sharedLib';

@Component({
  selector: 'app-sidebar',
  imports: [...SHARED_LIBS],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  currentRoute: string = '';
  isSidebarOpen = true;
  isSpaceSubmenuOpen = false;
  isSpaceSubmenuTooltip = false;
  constructor(private router: Router, private toastService: ToastService) {
    // Theo dõi thay đổi route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }
  ngOnInit() {
    this.checkScreenSize();
    this.currentRoute = this.router.url;
    document.addEventListener(
      'click',
      this.closeTooltipOnClickOutside.bind(this)
    );
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }
  // ------ check route ----------
  get isHomePage(): boolean {
    return this.currentRoute.includes('/home');
  }
  get isSpacePage(): boolean {
    return (
      this.currentRoute.includes('/viecduocgiao') ||
      this.currentRoute.includes('/viecquanly')
    );
  }
  get isViecduocgiaoPage(): boolean {
    return this.currentRoute.includes('/viecduocgiao');
  }
  get isViecquanlyPage(): boolean {
    return this.currentRoute.includes('/viecquanly');
  }
  get isDocumentPage(): boolean {
    return this.currentRoute.includes('/document');
  }
  get isAutomationPage(): boolean {
    return this.currentRoute.includes('/automation');
  }
  get isAIAgentPage(): boolean {
    return this.currentRoute.includes('/AIAgent');
  }

  // ------- toggle popup ---------

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    // Đóng submenu khi đóng sidebar
    if (!this.isSidebarOpen) {
      this.isSpaceSubmenuOpen = false;
      this.isSpaceSubmenuTooltip = false;
    }
  }

  toggleSpaceSubmenuTooltip(event?: MouseEvent) {
    if (!this.isSidebarOpen) {
      this.isSpaceSubmenuTooltip = !this.isSpaceSubmenuTooltip;
      if (event) {
        event.stopPropagation();
      }
    } else {
      this.isSpaceSubmenuOpen = !this.isSpaceSubmenuOpen;
    }
  }
  closeTooltipOnClickOutside() {
    if (this.isSpaceSubmenuTooltip) {
      this.isSpaceSubmenuTooltip = false;
    }
  }
  // --------
  checkScreenSize() {
    const isMobile = window.matchMedia('(max-width: 1300px)').matches;
    if (isMobile) {
      this.isSidebarOpen = false; // Đóng sidebar nếu là mobile
    } else {
      this.isSidebarOpen = true; // Mở sidebar nếu là desktop
    }
  }

  ngOnDestroy() {
    document.removeEventListener(
      'click',
      this.closeTooltipOnClickOutside.bind(this)
    );
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }
}
