import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class ParametroService {

    constructor(private _http: HttpClient) { }

    GetParametro(codParametro: string): Observable<any> {
        return this._http.get(URI_API + '/Parametros/GetParametro?CPAR_GRUPO_ID=' + codParametro);
    }

}