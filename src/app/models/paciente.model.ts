export class Paciente {
    id_persona: string;
    usuario_creacion: string;
}

export class PacientesFiltro {
    id_paciente: string;
    dni: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
}


export class PacientexDni
{
    paterno: string;
    materno: string;
    nombres: string;
    tipodocumento: string;
    dni: string;
    fechanacimiento: string;
    edad: number;
    genero: boolean;
    email: string;
    celular: string;
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    lote: string; 
    interior: string;    
    urbanizacion: string;
    referencia: string;
}

export class NuevoPaciente{

    id_documento: number;	

    id_pais: number;			
    
    numero: string;			
    
    nombres: string;			
    
    paterno: string;			
    
    materno: string;			
    
    email: string;			
    
    fechanacimiento: string; 
    
    genero: boolean;				
    
    usuariocreacion: number;		
    
    fechacreacion: string;		
    
    telefonocasa: string;		
    
    telefonocelular: string;  
     
}

   