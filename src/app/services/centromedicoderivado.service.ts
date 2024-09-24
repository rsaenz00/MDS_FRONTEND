import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class CentroMedicoDerivadoService {

    constructor(private _http: HttpClient) { }

    GetCentroMedicoDerivadoByTipoReferencia(tipo_referencia: number): Observable<any> {
        return this._http.get('CentroMedicoDerivado/GetCentroMedicoDerivadoByTipoReferencia?tipo_referencia=' + tipo_referencia);
    }

}