import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ToastService } from '../service/toast.service';
import { AuthService } from '../service/auth.service';
import { environment } from '../environment/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        this.handleHttpError(error);
        return throwError(() => error);
      })
    );
  }

  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 400:
        throw Error('Yêu cầu không hợp lệ');
      // this.toastService.Error('Yêu cầu không hợp lệ');
      // break;
      case 404:
        throw Error('Không tìm thấy tài nguyên');
      // this.toastService.Error('Không tìm thấy tài nguyên');
      // break;
      case 500:
        throw Error('Lỗi máy chủ');
      // this.toastService.Error('Lỗi máy chủ');
      // break;
      default:
        throw Error('Đã xảy ra lỗi không xác định');
      // this.toastService.Error('Đã xảy ra lỗi không xác định');
      // break;
    }
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      if (!refreshToken) {
        // Call logout if no refresh token
        this.authService.logout();
        return throwError(
          () => new Error('Hết phiên làm việc, vui lòng đăng nhập lại')
        );
      }
      // Match backend's expected request body: { refreshToken: string }
      return this.http
        .post<{ token: string; refreshToken: string }>(
          `${environment.SERVICE_API}refresh`,
          { refreshToken }
        )
        .pipe(
          switchMap((res) => {
            if (!res?.token || !res?.refreshToken) {
              this.authService.logout();

              return throwError(
                () => new Error('Hết phiên làm việc, vui lòng đăng nhập lại')
              );
            }

            // Update tokens in AuthService
            this.authService.setTokens(res.token, res.refreshToken);
            this.refreshTokenSubject.next(res.token);

            // Clone request with new token
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`,
              },
            });

            return next.handle(clonedRequest);
          }),
          catchError((err) => {
            this.authService.logout();

            const errorMessage =
              err.error?.message ||
              'Hết phiên làm việc, vui lòng đăng nhập lại';
            return throwError(() => new Error(errorMessage));
          }),
          finalize(() => {
            this.isRefreshing = false;
          })
        );
    } else {
      // Handle concurrent requests waiting for refresh
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          const clonedRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next.handle(clonedRequest);
        })
      );
    }
  }
}
