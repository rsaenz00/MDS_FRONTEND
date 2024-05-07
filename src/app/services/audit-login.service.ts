import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { CommonError } from '../helpers/error-handler/common-error';
import { AuditLogin } from '../models/audit-login';
import { AuditLoginResource } from '../models/resources/audit-login-resource';

@Injectable({
  providedIn: 'root'
})

export class AuditLoginService 
{
  constructor
  (
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  getLoginAudits(resource: AuditLoginResource): Observable<HttpResponse<AuditLogin[]> | CommonError> 
  {
    const url = `AuditoriaLogin`;
    const customParams = new HttpParams()
        .set('Fields', resource.fields)
        .set('OrderBy', resource.orderBy)
        .set('PageSize', resource.pageSize.toString())
        .set('Skip', resource.skip.toString())
        .set('SearchQuery', resource.searchQuery)
        // .set('id', resource.id.toString())
        .set('userName', resource.userName.toString())

    return this.httpClient.get<AuditLogin[]>(url, {
        params: customParams,
        observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));
}  

}
