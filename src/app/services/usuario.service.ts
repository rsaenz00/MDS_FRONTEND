import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { CommonError } from '../helpers/error-handler/common-error';
import { UsuarioClaim } from '../models/usuario-claim';
import { UsuarioResource } from '../models/resources/usuario-resource';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService 
{

  constructor
  (
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) { }

  updateUsuario(usuario: Usuario): Observable<Usuario | CommonError> 
  {
    const url = `user/${usuario.id}`;
    return this.httpClient.put<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addUser(usuario: Usuario): Observable<Usuario | CommonError> {
    const url = `user`;
    return this.httpClient.post<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteUser(id: string): Observable<void | CommonError> 
  {
    const url = `user/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUser(id: string): Observable<Usuario | CommonError> 
  {
    const url = `user/${id}`;
    return this.httpClient.get<Usuario>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateUserClaim(userClaims: UsuarioClaim[], userId: string): Observable<Usuario | CommonError> 
  {
    const url = `UserClaim/${userId}`;
    return this.httpClient.put<Usuario>(url, { userClaims })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  resetPassword(usuario: Usuario): Observable<Usuario | CommonError> 
  {
    const url = `user/resetpassword`;
    return this.httpClient.post<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  changePassword(usuario: Usuario): Observable<Usuario | CommonError> 
  {
    const url = `user/changepassword`;
    return this.httpClient.post<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateUserProfile(user: Usuario): Observable<Usuario | CommonError> 
  {
    const url = `user/profile`;
    return this.httpClient.put<Usuario>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUserProfile(): Observable<Usuario | CommonError> 
  {
    const url = `user/profile`;
    return this.httpClient.get<Usuario>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUsers(resource: UsuarioResource): Observable<HttpResponse<Usuario[]> | CommonError> 
  {
    const url = `Usuario`;
    const customParams = new HttpParams()
      .set('Fields', resource.fields)
      .set('OrderBy', resource.orderBy)
      .set('PageSize', resource.pageSize.toString())
      .set('Skip', resource.skip.toString())
      .set('SearchQuery', resource.searchQuery)
      .set('firstName', resource.first_name.toString())
      .set('lastName', resource.last_name.toString())
      .set('email', resource.email.toString())
      .set('phoneNumber', resource.phone_number.toString())
      .set('isActive', resource.is_active? '1':'0')

    return this.httpClient.get<Usuario[]>(url, {
      params: customParams,
      observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getRecentlyRegisteredUsers(): Observable<Usuario[] | CommonError> {
    const url = `user/GetRecentlyRegisteredUsers`;
    return this.httpClient.get<Usuario[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateProfilePhoto(form: FormData): Observable<Usuario | CommonError> {
    const url = `user/UpdateUserProfilePhoto`;
    return this.httpClient.post<Usuario>(url, form)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }  

}
