import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class UbigeoService {

    constructor(private _http: HttpClient) { }

    getUbigeosList(): Observable<any> {
        return this._http.get('Ubigeos/GetUbigeos');
    }

    getDepartamentoList(): Observable<any> {
        return this._http.get('Ubigeos/GetDepartamentos');
    }

    getProvinciaList(codDep: string): Observable<any> {
        return this._http.get('Ubigeos/GetProvincias?SUBI_COD_DPTO=' + codDep);
    }

    getDistritoList(codDep: string, codPro: string): Observable<any> {
        return this._http.get('Ubigeos/GetDistritos?SUBI_COD_DPTO=' + codDep + '&SUBI_COD_PROV=' + codPro);
    }

}