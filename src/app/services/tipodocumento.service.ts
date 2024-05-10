import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class TipoDocumentoService {

    constructor(private _http: HttpClient) { }

    GetTipoDocumentos(): Observable<any> {
        return this._http.get('TipoDocumentos/GetTipoDocumentos');
    }

}