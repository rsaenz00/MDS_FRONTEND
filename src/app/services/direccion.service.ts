import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Direccion } from '../models/direccion.model';

@Injectable({
    providedIn: 'root'
})

export class DireccionService {

    constructor(private _http: HttpClient) { }

    getDireccionesList(codPer: number): Observable<any> {
        return this._http.get('Direcciones/GetDirecciones?CPER_ID=' + codPer);
    }

    getDireccionList(codPer: number, codDir: number): Observable<any> {
        return this._http.get('Direcciones/GetDireccion?CPER_ID=' + codPer + '&CDIR_ID=' + codDir);
    }

    addDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Direccion>('Direcciones/AddDireccion', datos, { headers: cabecera });
    }

    updateDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Direccion>('Direcciones/UpdateDireccion', datos, { headers: cabecera });
    }

    deleteDireccion(data: Direccion): Observable<Direccion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<Direccion>('Direcciones/DeleteDireccion', { headers: cabecera, body: datos });
    }

    getDireccionLista(): Observable<any> {
        return this._http.get('Direcciones/GetListaDirecciones');
    }

}