import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Persona, PersonaGeneral, PersonaMad, PersonaMadActualizar } from '../models/persona.model';

@Injectable({
    providedIn: 'root'
})

export class PersonaService {

    constructor(private _http: HttpClient) { }

    getPersonaCodigo(): Observable<any> {
    return this._http.get('Persona/GetPersonaCodigo');
    }
    
    addPersonaMad(data: Persona): Observable<Persona> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<Persona>('Persona/AddPersonaSctr', datos, { headers: cabecera });
    }

    addPersonaSctr(data: Persona): Observable<Persona> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Persona>('Persona/AddPersonaSctr', datos, { headers: cabecera });
    }

    addNuevaPersonaMad(data:PersonaMad): Observable<PersonaMad> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<PersonaMad>('Persona/AddPersonaMad', datos, { headers: cabecera });
    }

    ActualizarPersonaMad(data:PersonaMadActualizar): Observable<PersonaMadActualizar> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<PersonaMadActualizar>('Persona/ActualizarPersonaMad', datos, { headers: cabecera });
    }
}