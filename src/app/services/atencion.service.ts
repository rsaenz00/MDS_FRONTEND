import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Atencion } from '../models/atencion.model';
import { HistoriaClinica } from '../models/historia_clinica.model';

@Injectable({
    providedIn: 'root'
})

export class AtencionService {

    constructor(private _http: HttpClient) { }

    //SERVICIO SCTR
    GetAtencionesSctrList(fechaInicio: string, fechaFin: string, condicion: number): Observable<any> {
        return this._http.get('Atenciones/GetAtencionesSctrBandeja?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&condicion=' + condicion);
    }

    GetAtencionSctrByCodigo(cod_atencion: string): Observable<any> {
        return this._http.get('Atenciones/GetAtencionSctrByCodigo?cod_atencion=' + cod_atencion);
    }

    GetAtencionesSctrFiltrO(fechaInicio: string, fechaFin: string, busqueda: string, condicion: string): Observable<any> {
        return this._http.get('Atenciones/GetAtencionesSctrFiltro?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&busqueda=' + busqueda + '&condicion=' + condicion);
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

    addAtencionSctr(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Atencion>('Atenciones/AddAtencionSctr', datos, { headers: cabecera });
    }

    updateAtencionSctr(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Atencion>('Atenciones/UpdateAtencionSctr', datos, { headers: cabecera });
    }

    deleteAtencionSctr(data: Atencion): Observable<Atencion> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<Atencion>('Atenciones/DeleteAtencionSctr', { headers: cabecera, body: datos });
    }
    //FIN SERVICIO SCTR
}