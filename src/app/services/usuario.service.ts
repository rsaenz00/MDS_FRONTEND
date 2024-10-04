import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PersonasSinUsuario, Usuario } from '../models/usuario';
import { CommonError } from '../helpers/error-handler/common-error';
import { UsuarioClaim } from '../models/usuario-claim';
import { UsuarioResource } from '../models/resources/usuario-resource';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor
    (
      private httpClient: HttpClient,
      private commonHttpErrorService: CommonHttpErrorService
    ) { }

  GetUsers(resource: UsuarioResource): Observable<HttpResponse<Usuario[]> | CommonError> {
    const url = `Usuario`;
    const customParams = new HttpParams()
      .set('pageSize', resource.pageSize.toString())
      .set('skip', resource.skip.toString())
      .set('OrderBy', resource.orderBy.toString())
      
      .set('email', resource.email.toString())
      .set('usuario', resource.usuario.toString())
      .set('persona', resource.persona.toString())
      .set('numero_documento', resource.numero_documento.toString())
      //.set('Fields', resource.fields)
      //.set('SearchQuery', resource.searchQuery)
      //.set('firstName', resource.first_name.toString())
      //.set('lastName', resource.last_name.toString())
      //.set('phoneNumber', resource.phone_number.toString())
      //.set('isActive', resource.is_active ? '1' : '0')

    return this.httpClient.get<Usuario[]>(url,
      {
        params: customParams,
        observe: 'response'
      }).pipe
      (
        catchError(this.commonHttpErrorService.handleError)
      );
  }

  GetUsuario(id: number): Observable<any> {
    return this.httpClient.get('Usuario/GetUsuario?vBusqueda=' + id);
  }

  GetPersonasSinUsuario(vBusqueda: string): Observable<any> {
    return this.httpClient.get<PersonasSinUsuario>('Usuario/GetPersonasSinUsuario?vBusqueda=' + vBusqueda);
  }

  GetRecentlyRegisteredUsers(): Observable<Usuario[] | CommonError> {
    const url = `user/GetRecentlyRegisteredUsers`;
    return this.httpClient.get<Usuario[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  AddUsuario(data: Usuario): Observable<Usuario> {
    const datos: string = JSON.stringify(data);
    let cabecera = new HttpHeaders();
    cabecera = cabecera.set('Content-Type', 'application/json');

    return this.httpClient.post<Usuario>('Usuario/AddUsuario', datos, { headers: cabecera });
  }

  AddUsuarioPersona(data: Usuario): Observable<Usuario> {
    const datos: string = JSON.stringify(data);
    let cabecera = new HttpHeaders();
    cabecera = cabecera.set('Content-Type', 'application/json');

    return this.httpClient.post<Usuario>('Usuario/AddUsuarioPersona', datos, { headers: cabecera });
  }

  UpdateUsuario(data: Usuario): Observable<Usuario> {
    const datos: string = JSON.stringify(data);
    let cabecera = new HttpHeaders();
    cabecera = cabecera.set('Content-Type', 'application/json');

    return this.httpClient.put<Usuario>('Usuario/UpdateUsuario', datos, { headers: cabecera });
  }

  ActivarUsuario(data: Usuario): Observable<Usuario> {
    const datos: string = JSON.stringify(data);
    let cabecera = new HttpHeaders();
    cabecera = cabecera.set('Content-Type', 'application/json');

    return this.httpClient.put<Usuario>('Usuario/ActivarUsuario', datos, { headers: cabecera });
  }

  DescativarUsuario(data: Usuario): Observable<Usuario> {
    const datos: string = JSON.stringify(data);
    let cabecera = new HttpHeaders();
    cabecera = cabecera.set('Content-Type', 'application/json');

    return this.httpClient.delete<Usuario>('Usuario/DesactivarUsuario', { headers: cabecera, body: datos });
  }

  /*deleteUser(id: string): Observable<void | CommonError> {
    const url = `user/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }*/

  /*getUsuario(id: string): Observable<Usuario | CommonError> {
    const url = `user/${id}`;
    return this.httpClient.get<Usuario>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }*/

  /*updateUserClaim(userClaims: UsuarioClaim[], userId: string): Observable<Usuario | CommonError> {
    const url = `UserClaim/${userId}`;
    return this.httpClient.put<Usuario>(url, { userClaims })
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  resetPassword(usuario: Usuario): Observable<Usuario | CommonError> {
    const url = `user/resetpassword`;
    return this.httpClient.post<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  changePassword(usuario: Usuario): Observable<Usuario | CommonError> {
    const url = `user/changepassword`;
    return this.httpClient.post<Usuario>(url, usuario)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updateUserProfile(user: Usuario): Observable<Usuario | CommonError> {
    const url = `user/profile`;
    return this.httpClient.put<Usuario>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUserProfile(): Observable<Usuario | CommonError> {
    const url = `user/profile`;
    return this.httpClient.get<Usuario>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }*/

  /*updateProfilePhoto(form: FormData): Observable<Usuario | CommonError> {
    const url = `user/UpdateUserProfilePhoto`;
    return this.httpClient.post<Usuario>(url, form)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }*/

}
