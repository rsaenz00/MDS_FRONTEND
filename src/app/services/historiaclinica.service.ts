import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HistoriaClinica } from '../models/historiaclinica.model';

@Injectable({
    providedIn: 'root'
})

export class HistoriaClinicaService {

    constructor(private _http: HttpClient) { }

    //SERVICIO SCTR
    GetHistoriasClinicasSctrList(fechaInicio: string, fechaFin: string, condicion: number): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriasClinicasSctrBandeja?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&condicion=' + condicion);
    }

    GetHistoriaClinicaSctrByCodigo(codHistoriaClinica: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinicaSctrByCodigo?cod_historia_clinica=' + codHistoriaClinica);
    }

    GetHistoriaClinicaSctrFiltrO(fechaInicio: string, fechaFin: string, busqueda: string, condicion: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriasClinicasSctrFiltro?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&busqueda=' + busqueda + '&condicion=' + condicion);
    }

    addHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<HistoriaClinica>('HistoriaClinica/AddHistoriaClinicaSctr', datos, { headers: cabecera });
    }

    updateHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<HistoriaClinica>('HistoriaClinica/UpdateHistoriaClinicaSctr', datos, { headers: cabecera });
    }

    deleteHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<HistoriaClinica>('HistoriaClinica/DeleteHistoriaClinicaSctr', { headers: cabecera, body: datos });
    }
    //FIN SERVICIO SCTR
}