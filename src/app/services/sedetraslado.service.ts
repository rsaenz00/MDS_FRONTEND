import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SedeTraslado } from '../models/sedetraslado.model';

@Injectable({
    providedIn: 'root'
})

export class SedeTrasladoService {

    constructor(private _http: HttpClient) { }

    GetSedeTraslado(): Observable<any> {
      return this._http.get('SedeTraslado/GetSedeTraslado');
    }

    GetSedesTrasladoFiltro(busqueda: string, condicion: string): Observable<any> {
        return this._http.get('SedeTraslado/GetSedesTrasladoFiltro?busqueda=' + busqueda + '&condicion=' + condicion);
    }

    addSedeTraslado(data: SedeTraslado): Observable<SedeTraslado> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<SedeTraslado>('SedeTraslado/AddSedeTraslado', datos, { headers: cabecera });
    }
    
    updateSedeTraslado(data: SedeTraslado): Observable<SedeTraslado> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<SedeTraslado>('SedeTraslado/UpdateSedeTraslado', datos, { headers: cabecera });
    }
}