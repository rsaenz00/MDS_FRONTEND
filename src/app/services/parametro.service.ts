import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ParametroService {

    constructor(private _http: HttpClient) { }

    GetParametro(codParametro: string): Observable<any> {
        return this._http.get('Parametros/GetParametro?CPAR_GRUPO_ID=' + codParametro);
    }

}