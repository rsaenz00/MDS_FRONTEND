import { ResourceParameter } from './resource-parameter';

export class AmbulanciaResource extends ResourceParameter {
    fechaDesde: string = '';
    fechaHasta: string = '';
    flagUrgEmeTras: boolean;
    flagEventos: boolean;
    flagOmedica: boolean;
    flagCanceladas: boolean;
    flagFinalizadas: boolean;

    codigoAtencion
    codigoSited: string = '';
    cotizado: string = '';
    estado: string = '';
    ambulanciaRespuesta: string = '';
    servicio: string = '';
    paciente: string = '';
    numeroDocumento: string = '';
    departamento: string = '';
    provincia: string = '';
    distrito: string = '';
    direccion: string = '';
    referencia: string = '';
    cliente: string = '';
    proveedor: string = '';
    ambulancia: string = '';
    tiempo: string = '';
    fechaEstimada: string = '';
    horaEstimada: string = '';
    fechaLlegada: string = '';
    horaLlegada: string = '';
    fechaFinAtencion: string = '';
    horaFinAtencion: string = '';
    telefonoCelular: string = '';
    usuarioCreacion: string = '';
    motivo: string = '';
    flagFueraCobertura: string = '';
    flagCitrix: string = '';
    estadoExp: string = '';
    codigoProv: string = '';
}