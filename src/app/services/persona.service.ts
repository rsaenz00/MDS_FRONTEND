import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Persona } from '../models/persona.model';

@Injectable({
    providedIn: 'root'
})

export class PersonaService {

    constructor(private _http: HttpClient) { }

    addPersonaSctr(data: Persona): Observable<Persona> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Persona>('Persona/AddPersonaSctr', datos, { headers: cabecera });
    }
}