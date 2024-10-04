import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '../helpers/error-handler/common-http-error.service';
import { Ambulancia } from '../models/ambulancia.model';
import { Observable, catchError, tap } from 'rxjs';
import { CommonError } from '../helpers/error-handler/common-error';
import { AmbulanciaResource } from '../models/resources/ambulancia-resource';

@Injectable({
  providedIn: 'root'
})
export class AmbulanciaService {

  constructor
    (
      private httpClient: HttpClient,
      private commonHttpErrorService: CommonHttpErrorService
    ) { }

  getAmbulancia(resource: AmbulanciaResource): Observable<HttpResponse<Ambulancia[]> | CommonError> {
    const url = `ambulancia`;
    const customParams = new HttpParams()
      .set('pageSize', resource.pageSize.toString())
      .set('skip', resource.skip.toString())
      .set('OrderBy', resource.orderBy.toString())

      // filter
      .set('fechaDesde', resource.fechaDesde.toString())
      .set('fechaHasta', resource.fechaHasta.toString())

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

    return this.httpClient.get<Ambulancia[]>(url,
      {
        params: customParams,
        observe: 'response'
      })
      .pipe
      (
        catchError(this.commonHttpErrorService.handleError)
      );
  }

  GetTipoServicioAmbulancia(tipoServicio: string): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoServicioAmbulancia?tipoServicio=' + tipoServicio);
  }

  GetPrioridadAmbulancia(tipoServicio: string): Observable<any> {
    return this.httpClient.get('Ambulancia/GetPrioridadAmbulancia?tipoServicio=' + tipoServicio);
  }

  GetTipoAmbulancia(): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoAmbulancia');
  }

  GetTipoTrasladoAmbulancia(tipoAmbulacia: number): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoTrasladoAmbulancia?tipoAmbulancia=' + tipoAmbulacia);
  }

  GetTipoPoliza(codCliente: number): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoPoliza?codigoCliente=' + codCliente);
  }

  GetTipoPolizaByCodigo(codPoliza: number): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoPolizaByCodigo?codigo=' + codPoliza);
  }

  GetMotivoAtencionAmbulancia(busqueda: string): Observable<any> {
    return this.httpClient.get('Ambulancia/GetMotivoAtencionAmbulancia?busqueda=' + busqueda);
  }

  GetProductoAmbulancia(busqueda: string, cliente: number): Observable<any> {
    return this.httpClient.get('Ambulancia/GetProductoAmbulancia?busqueda=' + busqueda + '&codCliente=' + cliente);
  }

  GetProveedorAmbulancia(): Observable<any> {
    return this.httpClient.get('Ambulancia/GetProveedorAmbulancia');
  }

  GetTipoComprobante(): Observable<any> {
    return this.httpClient.get('Ambulancia/GetTipoComprobante');
  }

}
