import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Seguimiento } from '../models/seguimiento.model';

@Injectable({
    providedIn: 'root'
})

export class SeguimientoService {

    constructor(private _http: HttpClient) { }

    GetSeguimientoByAtencion(codHistoriaClinica: string): Observable<any> {
        return this._http.get('Seguimientos/GetSeguimientoByHistoriaClinica?codHistoriaClinica=' + codHistoriaClinica);
    }

    AddSeguimientoSctr(data: Seguimiento): Observable<Seguimiento> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Seguimiento>('Seguimientos/AddSeguimientoSctr', datos, { headers: cabecera });
    }

}