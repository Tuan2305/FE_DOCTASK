import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { ResponseApi } from '../interface/response';
import { UserProgressModel } from '../models/review-job.model';
import { ResponsePaganation } from '../interface/response-paganation';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewChildJobService {
  private refreshTrigger$ = new BehaviorSubject<void>(undefined); // hoặc new Subject<void>()

  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }

  triggerRefresh() {
    this.refreshTrigger$.next();
  }

  onRefresh(
    taskid: string,
    startDate: string,
    endDate: string,
    listUserId: string[],
    numberPage: string
  ): Observable<ResponsePaganation<UserProgressModel>> {
    return this.refreshTrigger$.pipe(
      switchMap(() =>
        this.getReviewByUser(taskid, startDate, endDate, listUserId, numberPage)
      )
    );
  }

  getReviewByUser(
    taskid: string,
    startDate: string,
    endDate: string,
    listUserId: string[],
    numberPage: string
  ): Observable<ResponsePaganation<UserProgressModel>> {
    let params = new HttpParams()
      .set('taskId', taskid)
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('page', numberPage);

    // Nếu listUserId không rỗng, thêm nhiều userId
    listUserId.forEach((id) => {
      params = params.append('userId', id);
    });

    return this.http
      .get<ResponseApi<ResponsePaganation<UserProgressModel>>>(
        `${this.apiUrl}review/by-task-frequency`,
        {
          params,
        }
      )
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message);
          } else {
            return res.data;
          }
        })
      );
  }
  getUsersReview(taskid: string): Observable<UserModel[]> {
    const url = `${this.apiUrl}review/task/${taskid}/users`;

    return this.http.get<ResponseApi<UserModel[]>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return res.data;
        }
      })
    );
  }
  approveProgress(obj: {}): Observable<void> {
    const url = `${this.apiUrl}review/approve-progress`;

    return this.http.post<ResponseApi<void>>(url, obj).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return res.data;
        }
      })
    );
  }
  getFileReport(filePath: string): Observable<string> {
    const url = `${this.apiUrl}review/view-file?filePath=${filePath}`;

    return this.http.get<ResponseApi<string>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw new Error(res.message);
        } else {
          return res.data;
        }
      })
    );
  }
}
