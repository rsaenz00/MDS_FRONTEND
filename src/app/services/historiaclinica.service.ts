import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HistoriaClinica } from '../models/historiaclinica.model';
import { AmbulanciaResource } from '../models/resources/ambulancia-resource';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { Siteds } from '../models/siteds.model';

@Injectable({
    providedIn: 'root'
})

export class HistoriaClinicaService {

    constructor(private _http: HttpClient, private commonHttpErrorService: CommonHttpErrorService) { }

    //SERVICIO SCTR
    GetHistoriasClinicasSctrList(fechaInicio: string, fechaFin: string, condicion: number): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriasClinicasSctrBandeja?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&condicion=' + condicion);
    }

    GetHistoriaClinicaSctrByCodigo(codHistoriaClinica: string): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriaClinicaSctrByCodigo?cod_historia_clinica=' + codHistoriaClinica);
    }

    GetHistoriaClinicaSctrFiltro(fechaInicio: string, fechaFin: string, busqueda: string, condicion: string, reporte: number): Observable<any> {
        return this._http.get('HistoriaClinica/GetHistoriasClinicasSctrFiltro?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&busqueda=' + busqueda + '&condicion=' + condicion + '&reporte=' + reporte);
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

    deleteHistoriaClinicaSctr(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<HistoriaClinica>('HistoriaClinica/DeleteHistoriaClinicaSctr', { headers: cabecera, body: datos });
    }
    //FIN SERVICIO SCTR

    //INICIO SERVICIO MAD
    GetHistoriaClinicasList_Aseguradora(Aseguradora: string): Observable<any>
    {
        return this._http.get('HistoriaClinica/GetHistoriaClinica_Aseguradora?vAseguradora=' + Aseguradora);                           
    }

    addHistoriaClinicaSiteds(data: Siteds): Observable<Siteds> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Siteds>('HistoriaClinica/AddHistoriaClinicaSiteds', datos, { headers: cabecera });                                        
    }
    //FIN SERVICIO MAD

    //SERVICIO AMBULANCIA
    GetHistoriasClinicasAmbulanciaList(resource: AmbulanciaResource): Observable<any> {
        //return this._http.get('HistoriaClinica/GetHistoriasClinicasSctrBandeja?fechaInicio=' + fechaInicio + '&fechaFin=' + fechaFin + '&condicion=' + condicion);
        const customParams = new HttpParams()
            .set('pageSize', resource.pageSize.toString())
            .set('skip', resource.skip.toString())

            // filter
            .set('fechaDesde', resource.fechaDesde.toString())
            .set('fechaHasta', resource.fechaHasta.toString())
            .set('flagUrgEmeTras', resource.flagUrgEmeTras.toString())
            .set('flagEventos', resource.flagEventos.toString())
            .set('flagOmedica', resource.flagOmedica.toString())
            .set('flagCanceladas', resource.flagCanceladas.toString())
            .set('flagFinalizadas', resource.flagFinalizadas.toString())

            // Table Filter
            .set('codigoAtencion', resource.codigoAtencion.toString())
            .set('codigoSited', resource.codigoSited.toString())
            .set('cotizado', resource.cotizado.toString())
            .set('estado', resource.estado.toString())
            .set('ambulanciaRespuesta', resource.ambulanciaRespuesta.toString())
            .set('servicio', resource.servicio.toString())
            .set('paciente', resource.paciente.toString())
            .set('numeroDocumento', resource.numeroDocumento.toString())
            .set('departamento', resource.departamento.toString())
            .set('provincia', resource.provincia.toString())
            .set('distrito', resource.distrito.toString())
            .set('direccion', resource.direccion.toString())
            .set('referencia', resource.referencia.toString())
            .set('cliente', resource.cliente.toString())
            .set('proveedor', resource.proveedor.toString())
            .set('ambulancia', resource.ambulancia.toString())
            .set('tiempo', resource.tiempo.toString())
            .set('fechaEstimada', resource.fechaEstimada.toString())
            .set('horaEstimada', resource.horaEstimada.toString())
            .set('fechaLlegada', resource.fechaLlegada.toString())
            .set('horaLlegada', resource.horaLlegada.toString())
            .set('fechaFinAtencion', resource.fechaFinAtencion.toString())
            .set('horaFinAtencion', resource.horaFinAtencion.toString())
            .set('telefonoCelular', resource.telefonoCelular.toString())
            .set('usuarioCreacion', resource.usuarioCreacion.toString())
            .set('motivo', resource.motivo.toString())
            .set('flagFueraCobertura', resource.flagFueraCobertura.toString())
            .set('flagCitrix', resource.flagCitrix.toString())
            .set('codigoProv', resource.codigoProv.toString())

        return this._http.get<HistoriaClinica[]>('HistoriaClinica/GetHistoriasClinicasAmbulanciaBandeja',
            {
                params: customParams,
                observe: 'response'
            })
            .pipe
            (
                catchError(this.commonHttpErrorService.handleError)
            );
    }

    addHistoriaClinicaAmbulanciaOrientacionMedica(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<HistoriaClinica>('HistoriaClinica/AddHistoriaClinicaAmbulanciaOrientacionMedica', datos, { headers: cabecera });
    }

    addHistoriaClinicaAmbulancia(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<HistoriaClinica>('HistoriaClinica/AddHistoriaClinicaAmbulancia', datos, { headers: cabecera });
    }

    addHistoriaClinicaAmbulanciaEvento(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<HistoriaClinica>('HistoriaClinica/AddHistoriaClinicaAmbulanciaEvento', datos, { headers: cabecera });
    }

    deleteHistoriaClinicaAmbulancia(data: HistoriaClinica): Observable<HistoriaClinica> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<HistoriaClinica>('HistoriaClinica/DeleteHistoriaClinicaAmbulancia', { headers: cabecera, body: datos });
    }
    //FIN SERVICIO AMBULANCIA
}