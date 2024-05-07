import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class UbigeoService {

    constructor(private _http: HttpClient) { }

    getUbigeosList(): Observable<any> {
        return this._http.get(URI_API + '/Ubigeos/GetUbigeos');
    }

    getDepartamentoList(): Observable<any> {
        return this._http.get(URI_API + '/Ubigeos/GetDepartamentos');
    }

    getProvinciaList(codDep: string): Observable<any> {
        return this._http.get(URI_API + '/Ubigeos/GetProvincias?SUBI_COD_DPTO=' + codDep);
    }

    getDistritoList(codDep: string, codPro: string): Observable<any> {
        return this._http.get(URI_API + '/Ubigeos/GetDistritos?SUBI_COD_DPTO=' + codDep + '&SUBI_COD_PROV=' + codPro);
    }

}