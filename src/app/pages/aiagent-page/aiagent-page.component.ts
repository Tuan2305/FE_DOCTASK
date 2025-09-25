import { Component } from '@angular/core';
import { ToastService } from '../../service/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aiagent-page',
  imports: [CommonModule],
  templateUrl: './aiagent-page.component.html',
  styleUrl: './aiagent-page.component.css',
})
export class AIAgentPageComponent {
  constructor(private toastservice: ToastService) {}
  testToast() {
    this.toastservice.Success('ok');
  }
}
