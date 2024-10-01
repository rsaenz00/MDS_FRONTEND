import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Especialidades } from '../models/especialidad';

@Injectable({
    providedIn: 'root'
})

export class EspecialidadService {

    constructor(private _http: HttpClient) { }

    GetEspecialidadList(): Observable<any> {
        return this._http.get('Especialidades/GetEspecialidades');
    }

 }