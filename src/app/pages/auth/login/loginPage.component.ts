import { AuthService } from './../../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastComponent } from '../../../components/toast/toast.component';
import { ScreenLoadingComponent } from '../../../components/loading/screenLoading/screenLoading.component';
import { ToastService } from '../../../service/toast.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastComponent,
    ScreenLoadingComponent,
  ],
  templateUrl: './loginPage.component.html',
  styleUrls: ['./loginPage.component.css'],
})
export class LoginPageComponent implements OnInit {
  isLoading: boolean = false;

  authForm: FormGroup = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    this.isLoading = true;
    if (!this.authForm.invalid) {
      const { userName, password } = this.authForm.value;
      this.authService.login(userName, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: (err) => {
          this.isLoading = false;
          this.toastService.Warning(err.message ?? 'Đăng nhập thất bại');
        },
      });
    }
  }
  get userName() {
    return this.authForm.get('userName');
  }
  get password() {
    return this.authForm.get('password');
  }

  navigateToPage() {
    this.router.navigate(['/register'], { replaceUrl: true });
  }
}
