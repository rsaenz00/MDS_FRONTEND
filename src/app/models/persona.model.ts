export class Persona {
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    sexo: string;
    celular: string;
    usuario_creacion: string;
}

export class PersonaGeneral
{
    //SCTR
    tipo_documento: string;
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    sexo: string;
    celular: string;
    usuario_creacion: string;

    //MAD
    id_documento: number; 
    id_pais: number;
    id_ubigeo: string;
    numero: string;		
    //nombres: string;	
    paterno: string;	
    materno: string;	
    email: string;		
    fechanacimiento: Date;	
    genero: string;
    direccion: string;				
    usuariocreacion: number;	
    telefonocasa: string;		
    telefonocelular: string;	
}

export class PersonaMad
{
    id_persona: number;
    id_documento: number;
    id_pais: number;
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    genero: number;
    telefono_celular: string;
    estado: boolean;
    usuario_creacion: string;
    //fecha_creacion: Date;
}

export class PersonaMadActualizar
{
    id_persona: number;
    id_documento: number;
    id_pais: number;
    numero_documento: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
    fecha_nacimiento: Date;
    email: string;
    genero: number;
    telefono_celular: string;
    estado: boolean;
    usuario_modificacion: string;
    fecha_modificacion: Date;
}