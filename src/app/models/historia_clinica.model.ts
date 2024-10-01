export class HistoriaDni
{
    dni: string;
    paciente: string;
}
export class PacienteDni
{
    codigo: string;
    nombres: string;
    dni: string;
}

export class ClienteCodigo
{
    codigo: string;
    numero: string;
}

export class PacienteDistrito
{
    codigo: string;
    departamento: string;
    provincia: string;
    distrito: string;
}


export class HistoriaClinica
{
    e: string;
    codate: number;        
    distrito: string;
    paciente: string;
    fecha: Date;
}


export class ListadoHistoriaClinica
{
        e: string;
        prog: string;
        codate: number;
        clasif: string;
        e_tablet: string;
        codautorizacion: number;
        feclla: string;
        hrlla: string;
        tiempo: string;
        fecate: string;
        hrxdefecto: string;
        hrestimada: string;
        hrllegada: string;
        provincia: string;
        distrito: string;
        paciente: string;
        fpago: string;
        vip: string;
        grupo: string;
        periodo: string;
        cont: string;
        perfil: string;
        espec: string;
        doctor: string;
        grupos: string;
        empresa: string;
        usuario: string;
        cod_doc: string;
}

export class HistoriaClinicaMad
{
    cmed_id: number;						
    cpac_id: number;						
    cesp_id: number; 
    cest_id: number;
    cper_id: number; 
    cser_id: number; 
    cpai_id: number;     
    cubi_id: string; 
    cmep_id: number; 
    ctdo_id: number; 
    cclt_id: number; 
    cdsn_id: number; 
    estado: string; 
    prog: string; 
    codautorizacion: string; 
    feclla: Date; 
    horlla: Date; 
    tiempo: number; 
    fecate: Date; 
    horate: Date; 
    hrlledr: Date; 
    horoplla: Date; 
    fpago: string; 
    vip: string; 
    grupo: string; 
    cont: number; 
    perfil: string; 
    empresa: string; 
    usuariocreacion: string; 
    //fechacreacion: string; 
}

export class HClinica
{
    e: string;
    prog: string;
    codate: number;
    clasif: string;
    e_tablet: string;
    codautorizacion: number;
    feclla: string;
    hrlla: string;
    tiempo: string;
    fecate: string;
    hrxdefecto: string;
    hrestimada: string;
    hrllegada: string;
    provincia: string;
    distrito: string;
    paciente: string;
    fpago: string;
    vip: string;
    grupo: string;
    periodo: string;
    cont: string;
    perfil: string;
    espec: string;
    doctor: string;
    grupos: string;
    empresa: string;
    usuario: string;
    cod_doc: string;
}




export class FiltroPaciente
{
    dni: string;
    nombre: string;
}

export class ClienteSiteds
{
    id_cliente: string;
    id_financiamiento: string;
    nombre: string;
}

export class Aseguradora{
    id_cliente: string;
    nombre: string;
}

export class CategoriaAseguradora 
{
    id_cliente: string;
    nombre: string;
    descripcion: string;
}

export class Seguro
{
    id: number;
    nombre: string;
}

 export class ClasificacionServicio
 {
    id: number;
    nombre: string;
    descripcion: string;
 }











