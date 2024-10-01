import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})


export class ServicioNegocioService
{
    constructor(private _http: HttpClient){}

    GetHistoriaClinicasList_Clasificacion(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Clasificacion');
    }
}