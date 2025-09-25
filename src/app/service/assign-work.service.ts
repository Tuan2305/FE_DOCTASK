import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { map, Observable } from 'rxjs';
import { ResponseApi } from '../interface/response';
import { UserModel, UserRelationModel } from '../models/user.model';
import { UnitStructureModel } from '../models/unit.model';
import { TaskParentModel } from '../models/task-parent.model';

@Injectable({
  providedIn: 'root',
})
export class AssignWorkService {
  apiUrl: string;
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.SERVICE_API}`;
  }
  GetUnitsAssign(): Observable<UnitStructureModel> {
    const url = `${this.apiUrl}taskAssignment/get-subs-unit-current`;
    return this.http.get<ResponseApi<UnitStructureModel>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw Error(res.message);
        }
        return res.data;
      })
    );
  }

  GetUsersAssign(): Observable<UserRelationModel> {
    const url = `${this.apiUrl}taskAssignment/get-subs-user-current`;
    return this.http.get<ResponseApi<UserRelationModel>>(url).pipe(
      map((res) => {
        if (!res.success) {
          throw Error(res.message);
        }
        return res.data;
      })
    );
  }
  CreateParentTask(taskDesp: {}): Observable<TaskParentModel> {
    const url = `${this.apiUrl}task`;
    return this.http.post<ResponseApi<TaskParentModel>>(url, taskDesp).pipe(
      map((res) => {
        if (!res.success) {
          throw Error(res.message);
        }
        return res.data;
      })
    );
  }
  CreateChildTask(taskDesp: {}): Observable<CreateChildTaskResponse> {
    const url = `${this.apiUrl}taskAssignment/create-childTask`;
    return this.http
      .post<ResponseApi<CreateChildTaskResponse>>(url, taskDesp)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw Error(res.message);
          }
          return res.data;
        })
      );
  }
}
export interface CreateChildTaskResponse {
  taskId: number;
  scheduleDates: string[]; // hoặc Date[] nếu bạn parse về Date
}
