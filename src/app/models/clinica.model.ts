export class Clinica {
    id_clinica: string;
    clinica: string;
    ubigeo: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    telefono: string;
    afiliado: number;
    plan_huerfano_ilimitado: number;
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