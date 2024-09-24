import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class EspecialidadCallMedicoService {

    constructor(private _http: HttpClient) { }

    GetEspecialidadCallMedicoByCentroMedico(tipo_referencia: number): Observable<any> {
        return this._http.get('EspecialidadesCallMedico/GetEspecialidadCallMedicoByCentroMedico?id_centro_medico=' + tipo_referencia);
    }

}