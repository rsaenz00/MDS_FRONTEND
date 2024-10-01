export class Clinica {
    id_clinica: string;
    clinica: string;
    ubigeo: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    telefono: string;
    anexo: string;
    afiliado: string;
    plan_huerfano_ilimitado: string;
    estado: number;
}

export class ClinicasFiltro {
    id_clinica: string;
    ubigeo: string;
    departamento: string;
    provincia: string;
    distrito: string;
    clinica: string;
    direccion: string;
    telefono: string;
}


export class HistoriaDni
{
    //id_paciente: string;
    //nombres: string;
    //paterno: string;
    //materno: string;
    dni: string;
    //email: string;
    paciente: string;
}
