import { ToastService } from './toast.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { map, Observable } from 'rxjs';
import { ResponseApi } from '../interface/response';
import { AuthResponseModel } from '../models/authRespone.model';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
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
            // return false;
          } else {
            const item = res.data as AuthResponseModel;

            this.storageService.setEncrypted('accessToken', item.accessToken);
            this.storageService.setEncrypted('refreshToken', item.refreshToken);
            // this.storageService.setEncrypted('userId', item.userId.toString());
            // this.storageService.setEncrypted('userName', item.username);
            // this.storageService.setEncrypted('email', item.email);
            // this.storageService.setEncrypted('imageUrl', '');
            localStorage.setItem('auth/login', 'true');

            return true;
          }
        })
      );
  }
  getAccessToken(): string | null {
    return this.storageService.getDecrypted('accessToken');
  }

  getRefreshToken(): string | null {
    return this.storageService.getDecrypted('refreshToken');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.storageService.setEncrypted('accessToken', accessToken);
    this.storageService.setEncrypted('refreshToken', refreshToken);
  }

  clearTokens(): void {
    localStorage.clear();
  }

  logout(): void {
    this.clearTokens();
    localStorage.setItem('auth/login', 'false');
    this.router.navigate(['auth/login']);
  }

  getProfile(): Observable<{ email: string; username: string }> {
  const url = `${this.apiUrl}user/profile`;
  return this.http.get<ResponseApi<any>>(url).pipe(
    map((res) => {
      if (!res.success) throw new Error(res.message);
      return {
        email: res.data.email,
        username: res.data.username,
      };
    })
  );
}

}

