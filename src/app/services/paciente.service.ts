import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Paciente } from '../models/paciente.model';

@Injectable({
    providedIn: 'root'
})

export class PacienteService {

    constructor(private _http: HttpClient) { }

    GetPacientesList(): Observable<any> {
        return this._http.get('Pacientes/GetPacientes');
    }

    //CAMBIAR EL FILTRO POR NOMBRES COMPLETO DE PACIENTE
    GetPaciente_By_Dni(vBusqueda: string, vValor: string): Observable<any> {
        return this._http.get('Pacientes/GetPaciente_By_Dni?vBusqueda=' + vBusqueda + '&vValor=' + vValor);                      
    }

    GetPacientesFiltro(busqueda: string, condicion: string): Observable<any> {
        return this._http.get('Pacientes/GetPacientesFiltro?busqueda=' + busqueda + '&condicion=' + condicion);
    }

    addPaciente(data: Paciente): Observable<Paciente> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Paciente>('Pacientes/AddPaciente', datos, { headers: cabecera });
    }
}