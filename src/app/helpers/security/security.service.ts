import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { UsuarioAuth } from '../../models/usuario-auth';
import { CommonHttpErrorService } from '../error-handler/common-http-error.service';
import { CommonError } from '../error-handler/common-error';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';
import { ClonerService } from '../clone/clone.service';


@Injectable(
  { providedIn: 'root' }
)
export class SecurityService {
  // securityObject: UserAuth = new UserAuth();
  
  private _securityObject$: BehaviorSubject<UsuarioAuth|null> = new BehaviorSubject<UsuarioAuth|null>(null);

  public get securityObject$(): Observable<UsuarioAuth> {
    return this._securityObject$.pipe(
      map(c => {
        if (c) {
          return c;
        }
        const currenyData = localStorage.getItem('authObj');
        if (currenyData) {
          this._securityObject$.next(JSON.parse(currenyData))
          return JSON.parse(currenyData);
        }
        return null;
      })
    );
  }
  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    private router: Router,
    private clonerService: ClonerService
  ) {

  }

  login(entity: Usuario): Observable<UsuarioAuth | CommonError> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http.post<UsuarioAuth>('usuario/login', entity)
      .pipe(
        tap((resp) => 
        {
          let res = JSON.parse(JSON.stringify(resp));
          let usuarioAuth = res.resultData as UsuarioAuth;

          localStorage.setItem('authObj', JSON.stringify(usuarioAuth));
          localStorage.setItem('bearerToken', usuarioAuth.token);
          // localStorage.setItem('menu', usuarioAuth.menu);
          this._securityObject$.next(usuarioAuth); 
        })
      ).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  isLogin(): boolean {
    const authStr = localStorage.getItem('authObj');
    if (authStr)
      return true;
    else
      return false;
  }

  socialLogin(entity: Usuario): Observable<UsuarioAuth | CommonError> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http.post<UsuarioAuth>('SocialLogin/login', entity)
      .pipe(
        tap((resp) => {
          localStorage.setItem('authObj', JSON.stringify(resp));
          localStorage.setItem('bearerToken', resp.token);
          this._securityObject$.next(resp);
        })
      ).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  logout(): void {
    this.resetSecurityObject();
  }

  resetSecurityObject(): void {
    localStorage.removeItem('authObj');
    localStorage.removeItem('bearerToken');
    this._securityObject$.next(null);
    this.router.navigate(['/auth/login']);
  }

  updateUserProfile(user: Usuario) {
    const authObj: UsuarioAuth = JSON.parse(localStorage.getItem('authObj')as any);
    authObj.nombres = user.nombres;
    authObj.apellidoPaterno = user.apellidoPaterno;
    authObj.apellidoMaterno = user.apellidoMaterno;
    authObj.foto = user.foto;
    authObj.telefonoCelular = user.telefonoCelular;
    authObj.foto = user.foto;
    localStorage.setItem('authObj', JSON.stringify(authObj));
    this._securityObject$.next(this.clonerService.deepClone<UsuarioAuth>(authObj));
  }

  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  // tslint:disable-next-line: typedef
  hasClaim(claimType: any, claimValue?: any): boolean {
    let ret = false;
    // See if an array of values was passed in.
    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType, claimValue);
    } else {
      const claims: string[] = claimType;
      if (claims) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }
    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret = false;
    let auth: UsuarioAuth;
    // Retrieve security object
    const authStr = localStorage.getItem('authObj');
    if (authStr) {
      auth = JSON.parse(authStr);
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : 'true';
      }
      // Attempt to find the claim
      ret =
        auth.claims.find(
          (c) =>
            c.claimType && c.claimType.toLowerCase() == claimType && c.claimValue == claimValue
        ) != null;
    }
    return ret;
  }


  getUserDetail(): UsuarioAuth {
    var userJson = localStorage.getItem('authObj')as any;
    return JSON.parse(userJson);
  }
}
