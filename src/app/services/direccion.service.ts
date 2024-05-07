import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class DireccionService {

    constructor(private _http: HttpClient) { }

    getDireccionesList(codPer: number): Observable<any> {
        return this._http.get(URI_API + '/Direcciones/GetDireccion?CPER_ID=' + codPer);
    }

    getDireccionList(codPer: number, codDir: number): Observable<any> {
        return this._http.get(URI_API + '/Direcciones/GetDirecciones?CPER_ID='+codPer+'&CDIR_ID=' + codDir);
    }

    addDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Direccion>(URI_API + '/Direcciones/AddDireccion', datos, { headers: cabecera });
    }

    updateDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Direccion>(URI_API + '/Direcciones/UpdateDireccion', datos, { headers: cabecera });
    }

    deleteDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<Direccion>(URI_API + '/Direcciones/DeleteDireccion', { headers: cabecera, body: datos });
    }
    
}