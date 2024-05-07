import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Atencion } from '../models/atencion.model';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class AtencionService {

    constructor(private _http: HttpClient) { }

    GetAtencionesList(): Observable<any> {
        return this._http.get(URI_API + '/Atenciones/GetAtencionesBandeja');
    }

    addAtencion(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Atencion>(URI_API + '/Atenciones/AddAtencion', datos, { headers: cabecera });
    }

}