
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';

@Injectable({
    providedIn: 'root'
})

export class ClienteService {

    constructor(private _http: HttpClient) { }

    getClienteListByRuc(ruc: string): Observable<any> {
        return this._http.get('Clientes/GetClienteByRuc?ruc=' + ruc);
    }

}