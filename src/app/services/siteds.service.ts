import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Request_AsegCod_Obs_DatAdic_CondMed, Request_Asegurado, Request_NumeroAutorizacion, Siteds } from '../models/siteds.model';

@Injectable({
    providedIn: 'root'
})

export class SitedsService {

    constructor(private _http: HttpClient) { }

    //By Henrry
    GetByDni(data: Request_Asegurado): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByDni', datos, { headers: cabecera });
    }

    //By Henrry
    GetByNombresApellidos(data: Request_Asegurado): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByNombresApellidos', datos, { headers: cabecera });
    }

    //By Henrry
    GetByCodigo(data: Request_AsegCod_Obs_DatAdic_CondMed): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetByCodigo', datos, { headers: cabecera });
    }

    //By Henrry
    GetNumeroAutorizacion(data: Request_NumeroAutorizacion): Observable<any> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<any>('Siteds/GetNumeroAutorizacion', datos, { headers: cabecera });
    }

    //By William
    addHistoriaClinicaSiteds(data: Siteds): Observable<Siteds> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Siteds>('HistoriaClinica/AddHistoriaClinicaSiteds', datos, { headers: cabecera });                                        
    }

}