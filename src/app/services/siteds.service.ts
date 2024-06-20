import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Request_AsegCod_Obs_DatAdic_CondMed, Request_Asegurado, Request_NumeroAutorizacion } from '../models/siteds.model';

@Injectable({
    providedIn: 'root'
})

export class SitedsService {

    constructor(private _http: HttpClient) { }

    GetByDni(data: Request_Asegurado): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByDni', datos, { headers: cabecera });
    }

    GetByNombresApellidos(data: Request_Asegurado): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByNombresApellidos', datos, { headers: cabecera });
    }

    GetByCodigo(data: Request_AsegCod_Obs_DatAdic_CondMed): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByCodigo', datos, { headers: cabecera });
    }

    GetNumeroAutorizacion(data: Request_NumeroAutorizacion): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetNumeroAutorizacion', datos, { headers: cabecera });
    }

}