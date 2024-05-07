import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { catchError } from 'rxjs/operators';
import { CommonError } from '../helpers/error-handler/common-error';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})

export class DashboardService 
{
  constructor
  (
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  getActiveUserCount(): Observable<number | CommonError> 
  {
    const url = `dashboard/GetActiveUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getInactiveUserCount(): Observable<number | CommonError> 
  {
    const url = `dashboard/GetInactiveUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getTotalUserCount(): Observable<number | CommonError> 
  {
    const url = `dashboard/GetTotalUserCount`;
    return this.httpClient.get<number>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getOnlineUser(): Observable<Usuario[] | CommonError> 
  {
    const url = `dashboard/getOnlineUsers`;
    return this.httpClient.get<Usuario[]>(url).pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
