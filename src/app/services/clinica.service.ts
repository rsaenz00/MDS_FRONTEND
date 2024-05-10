import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Clinica } from '../models/clinica.model';

@Injectable({
    providedIn: 'root'
})

export class ClinicaService {

    constructor(private _http: HttpClient) { }

    GetClinicasList(): Observable<any> {
        return this._http.get('Clinicas/GetClinicas');
    }

    GetClinicasFiltro(busqueda: string, condicion: string): Observable<any> {
        return this._http.get('Clinicas/GetClinicasFiltro?busqueda=' + busqueda + '&condicion=' + condicion);
    }

    addClinica(data: Clinica): Observable<Clinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Clinica>('Clinicas/AddClinica', datos, { headers: cabecera });
    }

    updateClinica(data: Clinica): Observable<Clinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Clinica>('Clinicas/UpdateClinica', datos, { headers: cabecera });
    }
}