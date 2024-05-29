import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Atencion } from '../models/atencion.model';

@Injectable({
    providedIn: 'root'
})

export class AtencionService {

    constructor(private _http: HttpClient) { }

    GetAtencionesList(fechaInicio: string, fechaFin: string, condicion: number): Observable<any> {
        return this._http.get('Atenciones/GetAtencionesBandeja?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&condicion=' + condicion);
    }

    GetAtencionByCodigo(cod_atencion: string): Observable<any> {
        return this._http.get('Atenciones/GetAtencionByCodigo?cod_atencion=' + cod_atencion);
    }

    addAtencion(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Atencion>('Atenciones/AddAtencion', datos, { headers: cabecera });
    }

    updateAtencion(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Atencion>('Atenciones/UpdateAtencion', datos, { headers: cabecera });
    }

    deleteAtencion(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<Atencion>('Atenciones/DeleteAtencion', { headers: cabecera, body: datos });
    }

}