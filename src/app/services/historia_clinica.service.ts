import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HClinica, HistoriaClinica, HistoriaClinicaMad } from '../models/historia_clinica.model';
import { Siteds, SitedsPrueba } from '../models/siteds.model';

@Injectable({
    providedIn: 'root'
})


 export class HistoriaClinicaService{
    constructor(private _http: HttpClient){}
    //LISTADO DE TODAS LAS HISTORIAS CLINICAS
    GetHistoriaClinicasList(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica');
    }

    //
    GetPruebaHistoriaClinicasList(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetPruebaHistoriaClinicas');
    }

    //FILTRO BANDEJA
    GetHistoriaClinicaMadFiltro(vCampoBusqueda: string, vValorBusqueda: string,vFechaInicio: string,vFechaFinal: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Mad_Filtro?vCampoBusqueda=' + vCampoBusqueda + '&vValorBusqueda=' + vValorBusqueda + '&vFechaInicio=' + vFechaInicio + '&vFechaFinal=' + vFechaFinal);                              
    }    

    GetHistoriaClinicaMadFiltro_Rango_By_Fechas(vFechaInicio: string,vFechaFinal: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Mad_Filtro_Rango_By_Fechas?vFechaInicio=' + vFechaInicio + '&vFechaFinal=' + vFechaFinal);                              
    }    

    GetHistoriaClinicaMadFiltro_Campos(vCampoBusqueda: string, vValorBusqueda: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Mad_Filtro_Campos?vCampoBusqueda=' + vCampoBusqueda + '&vValorBusqueda=' + vValorBusqueda);                              
    }


    //PACIENTE BUSQUEDA POR DNI
    GetHistoriaClinicasList_Mad_Cliente(Numero: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Mad_Cliente?vNumero=' + Numero);
    }
    
    //PACIENTE BUSQUEDA POR DNI
    GetHistoriaClinicasList_Siteds_x_Codigo(Codigo: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetSiteds_Codigo?vCodigo=' + Codigo);
    }
    
    //PACIENTE BUSQUEDA POR DNI
    GetHistoriaClinicasList_Siteds_x_Numero(NumeroAutorizacion: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetSiteds_Numero?vNumero=' + NumeroAutorizacion);
    }
    
    //PACIENTE BUSQUEDA POR DNI
    GetHistoriaClinicasList_Paciente_x_Dni(vNumeroDni: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Paciente_x_Numero?vNumero=' + vNumeroDni);
    }

    //LISTADO - TXTCLIENTE
    GetHistoriaClinicasList_Cliente_Siteds_x_Nombre(vCliente: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Clientes_Siteds_By_Nombre?vCliente=' + vCliente);                           
    }
    
    //LISTADO - TXTCLIENTE
    GetHistoriaClinicasList_Cliente_Siteds(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Clientes_Siteds');                           
    }

    //LISTADO - TXTDISTRITO
    GetHistoriaClinicasList_Paciente_Distrito(Distrito: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Paciente_Distrito?vDistrito=' + Distrito);                           
    }
    

    //LISTADO - TXTCLIENTE
    GetHistoriaClinicasList_Aseguradora(Aseguradora: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Aseguradora?vAseguradora=' + Aseguradora);                           
    }

    //LISTADO - COMBO CATEGORIA
    GetHistoriaClinicasList_Categoria(vCategoria: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Aseguradora_Categoria?vAseguradora=' + vCategoria);
    }
    
    
    //LISTADO - COMBO CLASIFICACION
    GetHistoriaClinicasList_Clasificacion(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Clasificacion');
    }

    //LISTADO TIPO SEGURO = PACIENTE CLAVE
    GetHistoriaClinicasList_TipoSeguro(): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Seguro');
    }

    //
    GetHistoriaClinicas_Mad_Dni(): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Dni');
    }

    addHistoriaClinicaMad(data: HistoriaClinicaMad): Observable<HistoriaClinicaMad> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<HistoriaClinicaMad>('HistoriaClinica/AddHistoriaClinicaMad', datos, { headers: cabecera });                                     
    }

    addHistoriaClinicaSiteds(data: Siteds): Observable<Siteds> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<Siteds>('HistoriaClinica/AddHistoriaClinicaSiteds', datos, { headers: cabecera });
                                        
    }

    AddHistoriaClinicaSitedsPrueba(data: SitedsPrueba): Observable<SitedsPrueba> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');
        return this._http.post<SitedsPrueba>('HistoriaClinica/AddHistoriaClinicaSitedsPrueba', datos, { headers: cabecera });                                                                               
    }

    addHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<HistoriaClinica>('HistoriaClinica/AddHistoriaClinicaSctr', datos, { headers: cabecera });
    }

    updateHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<HistoriaClinica>('HistoriaClinica/UpdateHistoriaClinicaSctr', datos, { headers: cabecera });
    }


 }

