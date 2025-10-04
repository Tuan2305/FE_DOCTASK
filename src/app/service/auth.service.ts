import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { map, Observable } from 'rxjs';
import { ResponseApi } from '../interface/response';
import { AuthResponseModel } from '../models/authRespone.model';
// import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    // private storageService: StorageService
  ) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }
   login(userName: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}auth/login`;
    return this.http
      .post<ResponseApi>(url, { username: userName, password: password })
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message);
          } else {
            const item = res.data as AuthResponseModel;

            // Lưu thẳng token vào localStorage (không mã hóa)
            localStorage.setItem('accessToken', item.accessToken);
            localStorage.setItem('refreshToken', item.refreshToken);
            localStorage.setItem('auth/login', 'true');

            return true;
          }
        })
      );
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('auth/login');
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<{ email: string; username: string }> {
    const url = `${this.apiUrl}user/profile`;
    return this.http.get<ResponseApi<any>>(url).pipe(
      map((res) => {
        if (!res.success) throw new Error(res.message);

        const userId = res.data.userId;
        localStorage.setItem('userId', userId.toString());

        return {
          email: res.data.email,
          username: res.data.username,
        };
      })
    );
  }
}

