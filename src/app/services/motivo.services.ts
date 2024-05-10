import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class MotivoService {

    constructor(private _http: HttpClient) { }

    GetMotivosList(): Observable<any> {
        return this._http.get('Motivos/GetMotivos');
    }

    GetMotivosListByTipoAndPase(codTipoAtencion: number, codTipoPase: number): Observable<any> {
        return this._http.get('Motivos/GetMotivosByTipoAndPase?NMOT_TIPO_ATENCION=' + codTipoAtencion + '&NMOT_TIPO_PASE=' + codTipoPase);
    }

}