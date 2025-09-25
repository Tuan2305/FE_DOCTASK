import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from '../service/toast.service';
import { StorageService } from '../service/storage.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private toastService: ToastService,
    private storageService: StorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const excludedUrl = ['/login'];
    if (excludedUrl.some((url) => req.url.includes(url))) {
      return next.handle(req);
    }
    const token = this.storageService.getDecrypted('accessToken');
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
