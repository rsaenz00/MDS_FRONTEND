
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';
import { Cliente } from '../models/cliente.model';

@Injectable({
    providedIn: 'root'
})

export class ClienteService {

    constructor(private _http: HttpClient) { }

    getClienteListByRuc(ruc: string): Observable<any> {
        return this._http.get('Clientes/GetClienteByRuc?ruc=' + ruc);
    }

    addClienteSctr(data: Cliente): Observable<Cliente> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Cliente>('Clientes/AddClienteSctr', datos, { headers: cabecera });
    }

}