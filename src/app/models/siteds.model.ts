export class Request_Asegurado {
    CodTipoDocumentoAfiliado: string;
    NumeroDocumentoAfiliado: string;
    RUC: string;
    SUNASA: string;
    IAFAS: string;
    NombresAfiliado: string;
    ApellidoPaternoAfiliado: string;
    ApellidoMaternoAfiliado: string;
    CodEspecialidad: string;
}

export class Response_Siteds {
    datosAfiliado: Afiliado
}

export class Afiliado {
    codigoAfiliado: string;
    numeroPoliza: string;
    numeroContrato: string;
    numeroCertificado: string;
    codProducto: string;
    desProducto: string;
    apellidoPaternoAfiliado: string;
    apellidoMaternoAfiliado: string;
    nombresAfiliado: string;
    codGenero: string;
    desGenero: string;
    codFechaNacimiento: string;
    fechaNacimiento: string;
    codParentesco: string;
    desParentesco: string;
    codTipoDocumentoAfiliado: string;
    desTipoDocumentoAfiliado: string;
    numeroDocumentoAfiliado: string;
    edad: string;
    codFechaInicioVigencia: string;
    fechaInicioVigencia: string;
    codFechaFinVigencia: string;
    fechaFinVigencia: string;
    codEstadoCivil: string;
    desEstadoCivil: string;
    codTipoPlan: string;
    desTipoPlan: string;
    numeroPlan: string;
    codEstado: string;
    desEstado: string;
    codFechaActualizacionFoto: string;
    fechaActualizacionFoto: string;
    apellidoPaternoTitular: string;
    apellidoMaternoTitular: string;
    nombresTitular: string;
    codigoTitular: string;
    codTipoDocumentoTitular: string;
    desTipoDocumentoTitular: string;
    numeroDocumentoTitular: string;
    codMoneda: string;
    desMoneda: string;
    nombreContratante: string;
    codTipoDocumentoContratante: string;
    desTipoDocumentoContratante: string;
    codTipoAfiliacion: string;
    desTipoAfiliacion: string;
    codFechaAfiliacion: string;
    fechaAfiliacion: string;
    numeroDocumentoContratante: string;
    numeroContratoAfiliado: string;
    tipoCalificadorContratante: string;
    codSubTipoCobertura: string;
    codTipoCobertura: string;
    codEstadoMarital: string;
    numeroSCTR: string;
}

export class Request_AsegCod_Obs_DatAdic_CondMed {
    SUNASA: string;
    IAFAS: string;
    RUC: string;
    CodEspecialidad: string;
    NombresAfiliado: string;
    ApellidoPaternoAfiliado: string;
    ApellidoMaternoAfiliado: string;
    CodigoAfiliado: string;
    CodTipoDocumentoAfiliado: string;
    NumeroDocumentoAfiliado: string;
    CodProducto: string;
    DesProducto: string;
    NumeroPlan: string;
    CodTipoDocumentoContratante: string;
    NumeroDocumentoContratante: string;
    NombreContratante: string;
    CodParentesco: string;
    TipoCalificadorContratante: string;
}

export class Coberturas {
    CodigoTipoCobertura: string;
    CodigoSubTipoCobertura: string;
    CodigoCobertura: string;
    Beneficios: string;
    CodIndicadorRestriccion: string;
    Restricciones: string;
    CodCopagoFijo: string;
    DesCopagoFijo: string;
    CodCopagoVariable: string;
    DesCopagoVariable: string;
    CodFechaFinCarencia: string;
    FechaFinCarencia: string;
    CondicionesEspeciales: string;
    Observaciones: string;
    CodCalificacionServicio: string;
    DesCalificacionServicio: string;
    BeneficioMaximoInicial: string;
    NumeroCobertura: string;
    CodTipoMoneda: string;
    DesTipoMoneda: string;
}

export class Request_NumeroAutorizacion {
    ApellidoMaternoAfiliado: string;
    ApellidoPaternoAfiliado: string;
    BeneficioMaximoInicial: string;
    CodigoAfiliado: string;
    CodigoTitular: string;
    CodCalificacionServicio: string;
    CodEstado: string;
    CodEspecialidad: string;
    CodMoneda: string;
    CodCopagoFijo: string;
    CodCopagoVariable: string;
    CodParentesco: string;
    CodProducto: string;
    NumeroDocumentoContratante: string;
    CodSubTipoCobertura: string;
    CodTipoCobertura: string;
    CodTipoAfiliacion: string;
    DesProducto: string;
    CodEstadoMarital: string;
    CodFechaFinCarencia: string;
    CodFechaAfiliacion: string;
    CodFechaInicioVigencia: string;
    CodFechaNacimiento: string;
    CodGenero: string;
    SUNASA: string;
    IAFAS: string;
    CondicionesEspeciales: string;
    ApellidoMaternoTitular: string;
    NombreContratante: string;
    ApellidoPaternoTitular: string;
    NombresAfiliado: string;
    NombresTitular: string;
    NumeroCertificado: string;
    NumeroContrato: string;
    NumeroDocumentoAfiliado: string;
    NumeroDocumentoTitular: string;
    NumeroPlan: string;
    NumeroPoliza: string;
    RUC: string;
    CodTipoDocumentoContratante: string;
    CodTipoDocumentoAfiliado: string;
    CodTipoDocumentoTitular: string;
    CodTipoPlan: string;
    CodIndicadorRestriccion: string;
}