export class Ambulancia 
{
    cod_atencion : string;
    codigo_siteds : string;
    cotizado : string;
    estado : string;
    ambulancia_resp : string;
    servicio : string;
    paciente : string;
    dni : string;
    distrito : string;
    provincia : string;
    departamento : string;
    direccion : string;
    cliente : string;
    proveedor : string;
    ambulancia : string;
    tiempo : string;
    fecha_estimada : string;
    hora_estimada : string;
    fecha_llegada : string;
    hora_llegada : string;
    fecha_fin_ate : string;
    hora_fin_ate : string;
    referencia : string;
    tlf_celular : string;
    usuario_creacion : string;
    descripcion_motivo : string;
    flg_fuera_cobertura : string;
    flg_citrix : string;
    estado_exp : string;
    codigo_prov : string;
}

export class TipoServicioAmbulancia{
    id: string;
    nombre: string;
}

export class PrioridadAmbulancia{
    id: string;
    nombre: string;
}

export class TipoAmbulancia{
    id: number;
    nombre: string;
}

export class TipoTrasladoAmbulancia{
    id: number;
    nombre: string;
}

export class TipoPoliza{
    id: number;
    nombre: string;
}

export class VslidarPoliza{
    id: number;
    nombre: string;
    placa: boolean;
    poliza: boolean;
    siniestro: boolean;
}

export class MotivoAtencionAmbulancia{
    id: number;
    nombre: string;
}

export class Productos{
    id: number;
    nombre: string;
}

export class Proveedores{
    id: number;
    nombre: string;
}

export class TipoComprobante{
    id: number;
    nombre: string;
}

export class MotivoAnulacionServicio{
    id: number;
    nombre: string;
}