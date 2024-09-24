export class Direccion{
    id_direccion: number;
    id_persona: number;
    tipo_direccion: string;
    id_tipo_direccion: number;
    descripcion: string;
    cod_departamento: string;
    cod_provincia: string;
    cod_distrito: string;
    departamento: string;
    provincia: string;
    distrito: string;
    anexo: string;
    celular: string;
    telefono_fijo: string;
    nro_mz_lote: string;
    urbanizacion: string;
    referencia: string;
    dpto_interior: string;
    id_ubigeo: string;
    usuario_creacion: string;
    usuario_modificacion: string;
}

export class ListadoDirecciones
{
    paciente: string;
    tipo: string;
    direccion: string;
}