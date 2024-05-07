
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class ClienteService {

    constructor(private _http: HttpClient) { }

    getClienteListByRuc(ruc: string): Observable<any> {
        return this._http.get(URI_API + '/Clientes/GetClienteByRuc?ruc=' + ruc);
    }

}