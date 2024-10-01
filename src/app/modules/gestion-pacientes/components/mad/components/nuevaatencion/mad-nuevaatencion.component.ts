import { Component, computed, inject, Inject, Optional, signal, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HistoriaClinicaService } from "src/app/services/historia_clinica.service";
import { CategoriaAseguradora, ClasificacionServicio, HClinica, HistoriaClinica,HistoriaClinicaMad,HistoriaDni,PacienteDistrito, Seguro } from "src/app/models/historia_clinica.model";
import { TipoDocumentoService } from "src/app/services/tipodocumento.service";
import { TipoDocumento } from "src/app/models/tipodocumento.model";
import { ParametroService } from 'src/app/services/parametro.service';
import { Parametro } from 'src/app/models/parametro.model';
import { ClienteService } from "src/app/services/cliente.service";
import { Cliente } from "src/app/models/cliente.model";
import { ServicioNegocioService } from "src/app/services/servicionegocio.service";
import { ServicioNegocio } from "src/app/models/servicionegocio.model";
import { ToastrService } from "ngx-toastr";
import { FormBuilder,Validators } from "@angular/forms";
import { ImplicitReceiver } from "@angular/compiler";
import { MatOption } from '@angular/material/core';
import { SitedsComponent } from "../siteds/siteds.component";
import { UbigeoService } from "src/app/services/ubigeo.service";
import { Ubigeos } from "src/app/models/ubigeo.model";
import { ConsultaDniComponent } from "../consultadni/consultadni.component";
import { ListadopacientesComponent } from "../../../sctr/components/sctr-listado-pacientes/listado-pacientes.component";
import { NuevaDireccionComponent } from "../nuevadireccion/mad-nuevadireccion.component";
import { Paciente, PacientexDni } from "src/app/models/paciente.model";
import { Siteds, SitedsNumero,Siteds_Codigo } from "src/app/models/siteds.model";
import { ListadoubigeosComponent } from "../../../sctr/components/sctr-listado-ubigeos/listado-ubigeos.component";
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { PersonaGeneral,PersonaMad, PersonaMadActualizar } from "src/app/models/persona.model";
import { PersonaService } from "src/app/services/persona.service";
import { PacienteService } from "src/app/services/paciente.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { Direccion } from "src/app/models/direccion.model";
import { DireccionService } from "src/app/services/direccion.service";
import { MensajeComponent } from "../mensaje/mensaje.component";
import { CoreService } from "src/app/services/core.service";

//DECLARACION DE VARIABLES
var vAseguradora='';
var codAseguradora = 0;
var vMarcado = 1;

export interface comunicacion1 {
  nombre: string,
  checked: boolean,
  id: string
}
export interface comunicacion2 {
  nombre: string,
  checked: boolean,
  id: string
}

@Component
(
  {
    selector: 'app-mad-atencion',
    templateUrl: './mad-nuevaatencion.component.html',
    styleUrl: './mad-nuevaatencion.component.scss'
  }
)

export class MadNuevaAtencionComponent{
  
  selectedItems1:string[];
  selectedItems2:string[];
  private readonly _formBuilder = inject(FormBuilder);

 

options = this.settings.getOptions();
private readonly _marcado = inject(FormBuilder);
dataSource!: MatTableDataSource<HistoriaDni>;
vMensajeMad:any;
vMensajePaciente:any;
vMensajeEspecialidad:any;
countRows: number = 0;
usuarioEnlinea: UsuarioAuth;
datosPacienteSiteds = '';
datosDireccion = '';
numero_Dni: any;
pacienteMad : any;
codigo: any;
numero_autorizacion: any;
cliente_aseguradora: any;
pacienteSiteds: any;
fechaLlamada: any;
fechaAtencion: any;
showSpinner = false;
valGenero = 0;
valCliente = 0;
codCliente = 0;
codUbigeo = '';
valCategoria = 0;
valSexo = 0;
valTipoDocumento = 0;
valTipoCorreo = 0;
valVip = 0;
valSeguro = 0;
valClasificacion = 0;

valRuc = '';
valUbigeo = '';

valFormaPago = 0;
valMoneda = 0;
valMedico = 0;
valProgramacion = 0;
vCliente = '';
vClienteCambio : string; 
vPacienteCompleto: string;

tipoComunicacion: number = 1;

vNumeroMarcado = 0


constructor
    (
      private settings: CoreService,
        private _direccionService: DireccionService,
        private _pacienteService: PacienteService,
        private _personaService: PersonaService,
        private _dialog: MatDialog,
        private _clienteService: ClienteService,
        private _historiaclinicaService: HistoriaClinicaService,
        private _tipodocumentoService: TipoDocumentoService,
        private _parametroService: ParametroService,
        private _servicionegocioService: ServicioNegocioService, 
        private frm: FormBuilder, 
        public _dialogRef: MatDialogRef<MadNuevaAtencionComponent>, 
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private toastrService: ToastrService,
        private _ubigeoService: UbigeoService,    
  ) 
    {
      this.datosPacienteSiteds = data,
      this.numero_Dni = data.dni,
      this.numero_autorizacion = data.numeroautorizacion,
      this.cliente_aseguradora = data.cliente,
      this.pacienteMad = data.madpaciente
    }

FormularioNuevoPacienteMad = this.frm.group({
  txtAseguradora: [{ value: '', disabled: false }, Validators.required], //, Validators.required
  cboCategoria: [{ value: '', disabled: false }], //, Validators.required
  txtPaterno: [{ value: '', disabled: true }],//, Validators.required 
  txtMaterno: [{ value: '', disabled: true }],//, Validators.required
  txtNombres: [{ value: '', disabled: true }],//, Validators.required
  txtEdad: [{ value: '', disabled: false }], //, Validators.required
  txtFechaNacimiento: [{ value: '', disabled: false }],//, Validators.required
  cboTipoDocumento: [{ value: '', disabled: false }], //, Validators.required
  txtNumeroDocumento: [{ value: '', disabled: false }], //, Validators.required
  cboSexo: [{ value: '', disabled: false }], //, Validators.required
  cboVip: [{ value: '', disabled: false }, Validators.required], // --
  txtTelefonoCelular: [{ value: '', disabled: false }, Validators.required],// Validators.required
  cboSeguro: [{ value: '', disabled: false }], //, Validators.required
  cboClasificacion: [{ value: '', disabled: false }],//, Validators.required
  cboCondicion: [{ value: '', disabled: false }], //, Validators.required
  txtContactoAsegurado: [{ value: '', disabled: false }],//,Validators.required
  txtProducto: [{ value: '', disabled: false }], //, Validators.required
  txtCodigoAutorizacion: [{ value: '', disabled: false }], //,Validators.required
  txtSolicitud: [{ value: '', disabled: false }], //, Validators.required
  txtCodigoAsegurado: [{ value: '', disabled: false }], //, Validators.required
  txtPoliza: [{ value: '', disabled: false }],//, Validators.required
  txtDepartamento: [{ value: '', disabled: false }],//, Validators.required
  txtProvincia: [{ value: '', disabled: false }],//, Validators.required
  txtDistrito: [{ value: '', disabled: false },Validators.required], //, Validators.required
  txtDireccion: [{ value: '', disabled: false },Validators.required], //, Validators.required
  txtNumero1: [{ value: '', disabled: false }], //, Validators.required
  txtNumero2: [{ value: '', disabled: false }], //, Validators.required
  txtUrbanizacion: [{ value: '', disabled: false }], //, Validators.required
  txtReferencia: [{ value: '', disabled: false }], //, Validators.required
  txtTelefonoCasa: [{ value: '', disabled: false }], //, Validators.required
  txtTelefonoCorporativo: [{ value: '', disabled: false }], //, Validators.required
  txtAnexo: [{ value: '', disabled: false }], //, Validators.required
  txtContactoPaciente: [{ value: '', disabled: false }], //, Validators.required
  cboTipoCorreo: [{ value: '', disabled: false }], //, Validators.required
  txtEmail: [{ value: '', disabled: false }], //, Validators.required
  cboMedico: [{ value: '', disabled: false }], //, Validators.required
  txtSintomas: [{ value: '', disabled: false }, Validators.required], //
  txtEspecialidad: [{ value: '', disabled: false }, Validators.required], //
  txtProgramacion: [{ value: '', disabled: false }], //, Validators.required
  cboProgramacion: [{ value: '', disabled: false },Validators.required], //, 
  txtDescripcionSolicitud: [{ value: '', disabled: false }], //, Validators.required
  cboDescripcion: [{ value: '', disabled: false },Validators.required],  
  cboMoneda: [{ value: '', disabled: false }],//, Validators.required
  txtDeducible: [{ value: '', disabled: false }], //, Validators.required
  txtCoaseguro: [{ value: '', disabled: false }],//, Validators.required
  cboFormaPago: [{ value: '', disabled: false }], //, Validators.required
  chkFacebook: [{ value: '', disabled: false }], //, Validators.required
  chkInstagram: [{ value: '', disabled: false }], //, Validators.required
  chkYoutube: [{ value: '', disabled: false }], //, Validators.required
  chkPagina: [{ value: '', disabled: false }], //, Validators.required
  chkOtros: [{ value: '', disabled: false }], //, Validators.required
  chkNo: [{ value: '', disabled: false }], //, Validators.required

  //chkcampos: [{ value: '', disabled: false }], //, Validators.required
  
  
  txtAtencionCovid: [{ value: '', disabled: false }], //, Validators.required
  rbCovid: [{ value: '', disabled: false }], //, Validators.required
  cboTipoprueba: [{ value: '', disabled: false }], //, Validators.required
  txtFechacovid: [{ value: '', disabled: false }], //, Validators.required
  });
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
//-------------------------------------HABILITAR Y DESHABILITAR BOTONES----------------------------------
//-------------------------------------------------------------------------------------------------------
CHKDireccion = true;
//CMDSiteds  = true;
//CHKDireccionValida = true;
CHKMarcado: boolean = false;
CMDDireccion = true;
//-------------------------------------------------------------------------------------------------------
filtradoClientes: Cliente[];
filtradoDistritos: PacienteDistrito[];
tipoDocumentos : Parametro[];
categorias: CategoriaAseguradora[];
sexos: Parametro[];
formapagos: Parametro[];
monedas: Parametro[];
vips: Parametro[];
clasificaciones: ClasificacionServicio[];
Seguros: Seguro[];
persona: PersonaGeneral = {} as PersonaGeneral;
fechaNacimiento: any;
ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.getHistoriaClinicaPacienteByDni(this.numero_Dni);
    this.getSexosList();
    this.getTipoDocumentoList();
    this.getVipList();
    this.getClasificacionList();
    this.getSeguroList();
    this.getFormaPagosList();
    this.vDepartamento = 'LIMA';
    this.vProvincia = 'LIMA';
    this.vEspecialidad = 'GENERAL';


    this.selectedItems1 = new Array<string>();
    this.selectedItems2 = new Array<string>();
  
}
//---------------------------------------------------------------------------------
vMoneda: string;
vGenero: string;
vTipoDocumento: string;
vTipoCorreo: number;
vDistrito: string;
vDepartamento: string;
vProvincia: string;
vEspecialidad: string;
paciente: PacientexDni = {} as PacientexDni;


vNumeroComunicacion: string;

listaComunicacion: [];

medios1: comunicacion1[] = [
  {nombre:"Facebook", checked: false, id: "1"},
	{nombre:"Instagram", checked: false, id: "2"},
	{nombre:"Youtube", checked: false, id: "3"},
]

medios2: comunicacion2[] = [
  {nombre:"Paginas web o portales de noticias", checked: false, id: "4"},
  {nombre:"Otros", checked: false, id: "5"},
  {nombre:"No aplica", checked: false, id: "6"},
]

getComunicacionId(e:any, id:string)
{
	if(e.target.checked)
	{
		//console.log(id + 'si marcado');
		this.selectedItems1.push(id);
    this.selectedItems2.push(id);
    this.vNumeroComunicacion = id;// this.selectedItems1.push(id);
    console.log(this.vNumeroComunicacion);    
  }
	else
  {
		//console.log(id + 'no marcado');
		this.selectedItems1 = this.selectedItems1.filter(m=>m!=id);
		this.selectedItems2 = this.selectedItems2.filter(m=>m!=id);
    //this.vNumeroComucacion = this.selectedItems1.push(id);
    //this.vNumeroComucacion = this.selectedItems2.push(id);
    this.vNumeroComunicacion = id;// this.selectedItems1.push(id);
    console.log(this.vNumeroComunicacion);   
  }
	//console.log(this.selectedItems1);
	//console.log(this.selectedItems2);  
}


//seleccionarTodo(e:any){
//  this.comunicacion.forEach(x=> x.checked = e.target.checked)
//  console.log(e)
//}







getHistoriaClinicaPacienteByDni(vNumeroDni: string){
if(vNumeroDni != '')
{
  this._historiaclinicaService.GetHistoriaClinicasList_Paciente_x_Dni(this.numero_Dni).subscribe({
  next: (res) => {
        this.codigo = res.resultData[0].codigo;

        this.FormularioNuevoPacienteMad.controls['txtPaterno'].disable();
        this.FormularioNuevoPacienteMad.controls['txtPaterno'].setValue(res.resultData[0].paterno);
        this.FormularioNuevoPacienteMad.controls['txtMaterno'].setValue(res.resultData[0].materno);
        this.FormularioNuevoPacienteMad.controls['txtNombres'].setValue(res.resultData[0].nombres);
        this.vTipoDocumento = res.resultData[0].tipodocumento;
        if(this.vTipoDocumento == 'DOC.TRIB.NO.DOM.SIN.RUC')
        {
          this.valTipoDocumento = 1;
        }
        else if(this.vTipoDocumento == 'DNI')
        {
          this.valTipoDocumento = 2;
        }
        else if(this.vTipoDocumento == 'CARNET EXTRANJERIA')
        {
          this.valTipoDocumento = 3;
        }
        else if(this.vTipoDocumento == 'RUC')
        {
          this.valTipoDocumento = 4;
        }
        else if(this.vTipoDocumento == 'PASAPORTE')
        {
          this.valTipoDocumento = 5;
        }
        else if(this.vTipoDocumento == 'CEDULA DIPLOMATICA DE IDENTIDAD')
        {
          this.valTipoDocumento = 6;
        }
        else if(this.vTipoDocumento == 'PARTIDA DE NACIMIENTO')
        {
          this.valTipoDocumento = 7;
        }
        else if(this.vTipoDocumento == '(CNV) COD. NACIDO VIVO')
        {
          this.valTipoDocumento = 8;
        }
        else
        {
          this.valTipoDocumento = 9;
        }
        this.FormularioNuevoPacienteMad.controls['txtNumeroDocumento'].setValue(res.resultData[0].dni);
        this.FormularioNuevoPacienteMad.controls['txtEdad'].setValue(res.resultData[0].edad);
        this.FormularioNuevoPacienteMad.controls['txtFechaNacimiento'].setValue(res.resultData[0].fechanacimiento);
        this.vGenero =  res.resultData[0].genero;
        if(this.vGenero == 'MASCULINO')
        {
          this.valSexo = 1;
        }
        else
        {
          this.valSexo = 0;
        }
        this.FormularioNuevoPacienteMad.controls['txtEmail'].setValue(res.resultData[0].email);
        this.vTipoCorreo = parseInt(res.resultData[0].email);
        if(this.vTipoCorreo != 0)
        {
          this.valTipoCorreo = 1;
        }
        else
        {
          this.valTipoCorreo = 2;
        }
          this.FormularioNuevoPacienteMad.controls['txtTelefonoCelular'].setValue(res.resultData[0].celular);
          this.FormularioNuevoPacienteMad.controls['txtDistrito'].setValue(res.resultData[0].distrito);
          this.FormularioNuevoPacienteMad.controls['txtDepartamento'].setValue(res.resultData[0].departamento);
          this.FormularioNuevoPacienteMad.controls['txtProvincia'].setValue(res.resultData[0].provincia);        
          this.vDistrito = res.resultData[0].distrito;
        if(this.vDistrito !='')
        {
          this.CHKDireccion = false;
        }
        else
        {
          this.CHKDireccion = true;
        }    
        this.FormularioNuevoPacienteMad.controls['txtDireccion'].setValue(res.resultData[0].direccion);
        this.FormularioNuevoPacienteMad.controls['txtNumero1'].setValue(res.resultData[0].lote);
        this.FormularioNuevoPacienteMad.controls['txtNumero2'].setValue(res.resultData[0].interior);
        this.FormularioNuevoPacienteMad.controls['txtUrbanizacion'].setValue(res.resultData[0].urbanizacion);
        this.FormularioNuevoPacienteMad.controls['txtReferencia'].setValue(res.resultData[0].referencia);
      }
      ,
      error: console.log,    
      })
      this.CMDDireccion = false;
  }
  else
  {
    this.CMDDireccion = true;
  }
}

getMarcadoDireccion(target: any) {
  vMarcado = target.value;
  if (vMarcado == 1) 
  {
    vMarcado = 1;
    this.CHKMarcado = false;
    //this.CMDSiteds = false;
  }
  else
  {
    vMarcado = 0;
    this.CHKMarcado = true;
    //this.CMDSiteds = true;
  }
}
//--------------------------------------------------------------------------------------------------------
//INICIO TABLA CLIENTE
filterClientes(event: Event) {
  const ds = (event.target as HTMLInputElement).value;
  if (ds.length >= 1) {
    this._historiaclinicaService.GetHistoriaClinicasList_Aseguradora(ds).subscribe({
      next: (res) => {
        this.filtradoClientes = res.resultData;
        ds.length == 0;
      },
      error: console.log,
    });
  }
  else {
    this.filtradoClientes = [];
  }
}
selectCliente(option: MatOption) 
{
  this.codCliente = option.value.id_cliente; 
  vAseguradora = option.value.nombre;   
  this._historiaclinicaService.GetHistoriaClinicasList_Categoria(vAseguradora).subscribe({
    next: (res) => {
      this.categorias = res.resultData;
    },
    error: console.log,
  });
}
verRuc(cliente: Cliente): string 
{
  return cliente && cliente.nombre ? cliente.nombre.trim() : '';
}
//FIN TABLA CLIENTE
//------------------------------------------------------------------------------------------
//INICIO DE LA TABLA UBIGEO
filterUbigeos(event: Event) {
  //this.filtradoDistritos = [];
  const rs = (event.target as HTMLInputElement).value;
  //console.log(ds);
  if (rs.length >= 1) {
    this._historiaclinicaService.GetHistoriaClinicasList_Paciente_Distrito(rs).subscribe({
      next: (res) => {
        this.filtradoDistritos = res.resultData;
        //console.log(res.resultData);
      },
      error: console.log,
    });
  }
  else {
    this.filtradoDistritos = [];
  }
}
selectUbigeo(option: MatOption) 
{
  this.codUbigeo = option.value.codigo; 
  this.vDepartamento = option.value.departamento;
  this.vProvincia = option.value.provincia;
  this.vDistrito = option.value.distrito;   
}
verUbigeo(ubigeo: PacienteDistrito): string 
{
  return ubigeo && ubigeo.distrito ? ubigeo.distrito.trim() : '';
}
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
//chkFacebook: false,
//chkInstagram: false,
//chkYoutube: false,
//chkPagina: false,
//chkOtros: false,
//chkNo: false
getComunicacion(target: any) {
  this.tipoComunicacion = target.value;
  console.log(this.tipoComunicacion);
  if (this.tipoComunicacion == 1) 
  {

  } 
  else if(this.tipoComunicacion == 2)
  {

  }
  else if(this.tipoComunicacion == 3)
  {

  }
 else if(this.tipoComunicacion == 4)
 {

 }
 else if(this.tipoComunicacion == 5)
 {

 }
 else(this.tipoComunicacion == 6)
 {

 }
}
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
openUbigeoDialog() {
  const dialogRef = this._dialog.open(ListadoubigeosComponent, {
    disableClose: true,
    panelClass: 'sanna_theme',
    width: '550px'
  });
  dialogRef.afterClosed().subscribe(result => {
    this.codUbigeo = result.data.codigo;
    this.FormularioNuevoPacienteMad.controls['txtDepartamento'].setValue(result.data.departamento);
    this.FormularioNuevoPacienteMad.controls['txtProvincia'].setValue(result.data.provincia);
    this.FormularioNuevoPacienteMad.controls['txtDistrito'].setValue(result.data.distrito);
  });
}
//------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------
getAseguradoraList() 
{
    this._parametroService.GetParametro('2').subscribe({
      next: (res) => {
        this.categorias = res.resultData;
      },
      error: console.log,
    });
}
getAseguradora(target: any) 
{
    this.valCategoria = target.value;
}
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
getCategoria(target: any) 
{
    this.valCategoria = target.value;
}
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
getSexosList() 
{
    this._parametroService.GetParametro('1').subscribe({
      next: (res) => {
        this.sexos = res.resultData;
      },
      error: console.log,
    });
}
getSexo(target: any) 
{
    this.valSexo = target.value;
}
//-----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
getFormaPagosList() 
{
    this._parametroService.GetParametro('4').subscribe({
      next: (res) => {
        this.formapagos = res.resultData;
      },
      error: console.log,
    });
}
getFormaPago(target: any) 
{
    this.valFormaPago = target.value;
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
getTipoDocumentoList() 
{
    this._tipodocumentoService.GetTipoDocumentos().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
}
getTipoDocumento(target: any) 
{
    this.valTipoDocumento = target.value;
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
vNombreVip = '';
getVipList() 
{
  this._parametroService.GetParametro('3').subscribe({
    next: (res) => {
      this.vips = res.resultData;
    },
      error: console.log,
    });
}
getVip(target: any) 
{
    this.valVip = target.value;
    if(this.valVip == 1)
    {
      this.vNombreVip = "NO";
    }
    else if(this.valVip == 2)
    {
      this.vNombreVip = "VIP";
    }
    else
    {
      this.vNombreVip = "MINT";
    }
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
getClasificacionList() 
{
    this._servicionegocioService.GetHistoriaClinicasList_Clasificacion().subscribe({
        next: (res) => {
        this.clasificaciones = res.resultData;
      },
      error: console.log,
    });
}
getClasificacion(target: any) 
{
    this.valClasificacion = target.value;
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
getSeguroList() 
{
    this._historiaclinicaService.GetHistoriaClinicasList_TipoSeguro().subscribe({
      next: (res) => {
        this.Seguros = res.resultData;
      },
      error: console.log,
    });
}
getSeguro(target: any) 
{
    this.valSeguro = target.value;
}
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//------------------------------LLAMAR A LA VENTANA DE SITEDS------------------------ 
siteds: SitedsNumero;
vIdCliente = '';
vNombreCliente = '';
openSitedsDialog() {
  if(this.FormularioNuevoPacienteMad.value["txtDistrito"]?.toString() == '')
    {
      this.toastrService.warning('Falta validar la direccion');
      this.CHKDireccion = false;
    }
    else
    {
      const dialogRef = this._dialog.open(SitedsComponent,
        {
          disableClose: true,
          panelClass: 'sanna_theme',
        });
        dialogRef.afterClosed().subscribe(result => {
          this.datosPacienteSiteds = result.data;
          this.pacienteMad = this.FormularioNuevoPacienteMad.value["txtNombres"]?.toString() +  ' ' + this.FormularioNuevoPacienteMad.value["txtPaterno"]?.toString() + ' ' + this.FormularioNuevoPacienteMad.value["txtMaterno"]?.toString();
          this.pacienteSiteds = this.datosPacienteSiteds["paciente"];
          if(this.datosPacienteSiteds["codAutorizacion"] != '')
          {            
            this._historiaclinicaService.GetHistoriaClinicasList_Siteds_x_Numero(this.datosPacienteSiteds["codAutorizacion"]).subscribe({
              next: (res) => { 
                this.codCliente = parseInt(this.datosPacienteSiteds["cliente"]);
                if(this.codCliente !=0)
                  {
                    this._historiaclinicaService.GetHistoriaClinicasList_Siteds_x_Codigo(this.codCliente.toString()).subscribe({
                      next:(res) =>
                      {
                        this.filtradoClientes = res.resultData;
                        this.verRuc(res.resultData);
                        for(let option of this.filtradoClientes)
                        {
                          this.vIdCliente = option.id_cliente;
                          this.vNombreCliente = option.nombre;
                          this.valRuc = option.nombre;
                        }
                        this.FormularioNuevoPacienteMad.get("txtAseguradora")?.setValue(this.vNombreCliente);
                      }    
                    })          
                  } 
                this.FormularioNuevoPacienteMad.controls['txtPaterno'].setValue(res.resultData[0].paterno);
                this.FormularioNuevoPacienteMad.controls['txtMaterno'].setValue(res.resultData[0].materno);
                this.FormularioNuevoPacienteMad.controls['txtNombres'].setValue(res.resultData[0].nombres);
                this.FormularioNuevoPacienteMad.controls['txtEdad'].setValue(res.resultData[0].edad);
                this.FormularioNuevoPacienteMad.controls['txtFechaNacimiento'].setValue(this.datosPacienteSiteds["fechanacimiento"]);
                this.vTipoDocumento = res.resultData[0].tipodocumento;
                if(this.vTipoDocumento == 'DNI')
                  {
                    this.valTipoDocumento = 2;
                  }                
                this.FormularioNuevoPacienteMad.controls['txtNumeroDocumento'].setValue(this.datosPacienteSiteds["numeroDocumento"]);
                this.vGenero =   res.resultData[0].genero;
                if( this.vGenero == 'MASCULINO')
                {
                    this.valSexo = 1;
                }
                else
                {
                    this.valSexo = 0;
                }                
                this.FormularioNuevoPacienteMad.controls['txtProducto'].setValue(this.datosPacienteSiteds["producto"]);
                this.FormularioNuevoPacienteMad.controls['txtCodigoAutorizacion'].setValue(res.resultData[0].numeroautorizacion);
                this.FormularioNuevoPacienteMad.controls['txtSolicitud'].setValue(res.resultData[0].numerocontrato);
                this.FormularioNuevoPacienteMad.controls['txtCodigoAsegurado'].setValue(res.resultData[0].codigoafiliado);
                this.FormularioNuevoPacienteMad.controls['txtPoliza'].setValue(res.resultData[0].numeropoliza);
                this.vMoneda = this.datosPacienteSiteds["moneda"];
                if(this.vMoneda == 'SOLES')
                {
                    this.valMoneda = 1;
                }
                else
                {
                    this.valMoneda = 2;
                }
                this.FormularioNuevoPacienteMad.controls['cboMoneda'].setValue(this.datosPacienteSiteds["moneda"]);              
                this.FormularioNuevoPacienteMad.controls['txtDeducible'].setValue(this.datosPacienteSiteds["deducible"]);
                this.FormularioNuevoPacienteMad.controls['txtCoaseguro'].setValue(this.datosPacienteSiteds["deducible"]);
              },
              error: console.log,
            });       
          }
        });
    }
  }
//--------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------
  openMadBuscarPacienteDialog() {
    this._dialog.open(ListadopacientesComponent,
      {
        panelClass: `sanna_theme`
      }
    );
  }
//----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------BOTON NUEVA DIRECCION
  openMadDireccionDialog() 
  {
    if(this.codigo != '')
    {
        const dialogRef =  this._dialog.open(NuevaDireccionComponent,
        {
          panelClass: `sanna_theme`,
          data: { 'idpersona': this.codigo},
        }
      );
      dialogRef.afterClosed().subscribe(result => {
        this.datosDireccion = result.data;
        this.FormularioNuevoPacienteMad.controls['txtDistrito'].setValue(this.datosDireccion["distrito"]);
        this.FormularioNuevoPacienteMad.controls['txtDireccion'].setValue(this.datosDireccion["direccion"]);
        this.FormularioNuevoPacienteMad.controls['txtUrbanizacion'].setValue(this.datosDireccion["urbanizacion"]);
        this.FormularioNuevoPacienteMad.controls['txtReferencia'].setValue(this.datosDireccion["referencia"]);
        this.FormularioNuevoPacienteMad.controls['txtNumero1'].setValue(this.datosDireccion["numero"]); 
        this.FormularioNuevoPacienteMad.controls['txtNumero2'].setValue(this.datosDireccion["interior"]);
        this.FormularioNuevoPacienteMad.controls['txtTelefonoCorporativo'].setValue(this.datosDireccion["celular"]);
        this.FormularioNuevoPacienteMad.controls['txtAnexo'].setValue(this.datosDireccion["anexo"]);
        this.codUbigeo = this.datosDireccion["CodigoUbigeo"];
        if(this.codUbigeo != '')
        {
          this._ubigeoService.getUbigeoCodigo(this.codUbigeo).subscribe({
            next:(res)=>{
              this.FormularioNuevoPacienteMad.controls['txtDepartamento'].setValue(res.resultData[0].departamento);
              this.FormularioNuevoPacienteMad.controls['txtProvincia'].setValue(res.resultData[0].provincia);
              this.FormularioNuevoPacienteMad.controls['txtDistrito'].setValue(res.resultData[0].distrito);
            }
          })          
        }
      })
    }
  }
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
  exitAtencion() {
    this.FormularioNuevoPacienteMad.reset();
    this._dialogRef.close(true);
  }
  personamad: PersonaMad = {} as PersonaMad;
  personamadactualizar: PersonaMadActualizar = {} as PersonaMadActualizar;
  historiaclinica: HistoriaClinicaMad = {} as HistoriaClinicaMad;
  direccion: Direccion = {} as Direccion;
  vRegistro = 0;
  vFila = 0;
  vSintomas = '';
  vFechaNacimiento : any;
  vId_Persona = 0;
  vDniPersona = '';
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
//INICIO DE REGISTRAR MAD EN ESTADO =======>  0

  opciones = [];
  ValidarOpciones(): boolean
  {
    return this.opciones.length>0 ? true:false;
  }

  RegistrarNuevaHistoriaClinica() 
  {
    if (this.FormularioNuevoPacienteMad.valid) {
      //VALIDAR DISTRITO
      this.vDistrito = this.FormularioNuevoPacienteMad.value["txtDistrito"]?.toString() || '';
      if(this.vDistrito != '')
      {
          this._historiaclinicaService.GetHistoriaClinicasList_Paciente_Distrito(this.vDistrito).subscribe({
            next:(res) =>{
              this.codUbigeo = res.resultData[0].codigo;
              this.FormularioNuevoPacienteMad.value["txtDistrito"] = res.resultData[0].distrito;
              this.FormularioNuevoPacienteMad.value["txtProvincia"] = res.resultData[0].provincia;
              this.FormularioNuevoPacienteMad.value["txtDepartamento"] = res.resultData[0].departamento;
            }
          })
      }
      //VALIDAR CONTROLES REQUERIDOS
      this.vSintomas = this.FormularioNuevoPacienteMad.value["txtSintomas"]?.toString() || '';
      //------------------------------------INICIO REGISTRAR PACIENTE
      if(this.FormularioNuevoPacienteMad.value["txtAseguradora"]?.toString() == '')
      {
        this.toastrService.warning('Debe Ingresar la Aseguradora del Paciente');
      }
      else if(this.FormularioNuevoPacienteMad.value["txtDistrito"]?.toString() == '')
      {
        this.toastrService.warning('Debe Ingresar el Distrito del Paciente');
      }
      else if(this.FormularioNuevoPacienteMad.value["cboVip"] == '')
      {
        this.toastrService.warning('Debe Elegir una opcion de Vip');        
      }
      else if(this.FormularioNuevoPacienteMad.value["txtTelefonoCelular"]?.toString() == '')
      {
        this.toastrService.warning('Debe ingresar su Numero de Celular');        
      }
      else if(this.vSintomas == null || this.vSintomas == '')
      {
        this.toastrService.warning('Debe Ingresar los Sintomas del Paciente');
      }
      else if(this.FormularioNuevoPacienteMad.value["cboProgramacion"]?.toString() == '')
      {
        this.toastrService.warning('Debe seleccionar el medio de programacion');
      }
      else if(this.FormularioNuevoPacienteMad.value["cboDescripcion"]?.toString() == '')
      {
        this.toastrService.warning('Debe seleccionar el medio de comunicacion');
      }
      else
      {
        this.numero_Dni = this.FormularioNuevoPacienteMad.value["txtNumeroDocumento"]?.toString() || '';
        this._pacienteService.GetPaciente_By_Dni("Dni",this.numero_Dni).subscribe({
          next: (res) => {
              this.dataSource = new MatTableDataSource(res.resultData);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
                this.countRows = this.dataSource.filteredData.length;          
                this.vRegistro = this.countRows;
                if(this.vRegistro != 0)
                {
                  //-----------------------------------------EDITAR PACIENTE                  
                  //FALTA PROCEDIMIENTO PARA CAPTURAR EL CODIGO DE PERSONA PARA ACTUALIZAR
                  this.vPacienteCompleto = this.FormularioNuevoPacienteMad.value["txtNombres"]?.toString() + ' ' + this.FormularioNuevoPacienteMad.value["txtPaterno"]?.toString() + ' ' + this.FormularioNuevoPacienteMad.value["txtMaterno"]?.toString();
                  this.vFechaNacimiento = this.FormularioNuevoPacienteMad.value["txtFechaNacimiento"]?.toString() || ''
                  this.personamadactualizar.id_persona = 1;
                  this.personamadactualizar.id_documento = this.valTipoDocumento;
                  this.personamadactualizar.id_pais = 1;
                  this.personamadactualizar.numero_documento = this.FormularioNuevoPacienteMad.value["txtNumeroDocumento"]?.toString() || '';
                  this.personamadactualizar.nombres = this.FormularioNuevoPacienteMad.value["txtNombres"]?.toString() || '';
                  this.personamadactualizar.apellido_paterno = this.FormularioNuevoPacienteMad.value["txtPaterno"]?.toString() || '';
                  this.personamadactualizar.apellido_materno = this.FormularioNuevoPacienteMad.value["txtMaterno"]?.toString() || '';
                  this.personamadactualizar.fecha_nacimiento = new Date(this.vFechaNacimiento);
                  this.personamadactualizar.email = this.FormularioNuevoPacienteMad.value["txtEmail"]?.toString() || '';  
                  this.personamadactualizar.genero = this.valSexo;
                  this.personamadactualizar.telefono_celular = this.FormularioNuevoPacienteMad.value["txtTelefonoCelular"]?.toString() || '';
                  this.personamadactualizar.estado = true;
                  this.personamadactualizar.usuario_modificacion = this.usuarioEnlinea.id || '';
                  this.personamadactualizar.fecha_modificacion = new Date();
                  this.vDniPersona = this.FormularioNuevoPacienteMad.value["txtNumeroDocumento"]?.toString() || '';
                }
                else
                {
                  //-----------------------------------------NUEVO PACIENTE
                  this.vPacienteCompleto = this.FormularioNuevoPacienteMad.value["txtNombres"]?.toString() + ' ' + this.FormularioNuevoPacienteMad.value["txtPaterno"]?.toString() + ' ' + this.FormularioNuevoPacienteMad.value["txtMaterno"]?.toString();
                  this.vFechaNacimiento = this.FormularioNuevoPacienteMad.value["txtFechaNacimiento"]?.toString() || '';
                  this.personamad.id_documento = this.valTipoDocumento;
                  this.personamad.id_pais = 1;
                  this.personamad.numero_documento = this.FormularioNuevoPacienteMad.value["txtNumeroDocumento"]?.toString() || '';
                  this.personamad.nombres = this.FormularioNuevoPacienteMad.value["txtNombres"]?.toString() || '';
                  this.personamad.apellido_paterno = this.FormularioNuevoPacienteMad.value["txtPaterno"]?.toString() || '';
                  this.personamad.apellido_materno = this.FormularioNuevoPacienteMad.value["txtMaterno"]?.toString() || '';
                  //this.personamad.fecha_nacimiento = this.vFechaNacimiento;
                  this.personamad.genero = this.valSexo;
                  this.personamad.telefono_celular = this.FormularioNuevoPacienteMad.value["txtTelefonoCelular"]?.toString() || '';
                  this.personamad.estado = true;
                  this.personamad.usuario_creacion = this.usuarioEnlinea.id || '';
                  this.vDniPersona = this.FormularioNuevoPacienteMad.value["txtNumeroDocumento"]?.toString() || '';
                  this._personaService.addNuevaPersonaMad(this.personamad).subscribe({
                  next:(val: any)=>{
                    this._personaService.getPersonaCodigo().subscribe({
                    next: (res) => {
                      this.vId_Persona = res.resultData[0].id_persona;
                      this.vFila = this.countRows;
                  if(this.vFila == 0 )
                  {
                    //TABLA HISTORIA CLINICA ==> EMPEZAR A GUARDAR DATOS EN LOS CAMPOS   
                    this.historiaclinica.cmed_id =  9886;                       //MEDICO						
                    this.historiaclinica.cpac_id =	this.vId_Persona;		                //PACIENTE			
                    this.historiaclinica.cesp_id =  1;                        //ESPECIALIDAD
                    this.historiaclinica.cest_id =  1;                        //ESTADO
                    this.historiaclinica.cper_id =  this.vId_Persona;                  //PERSONA
                    this.historiaclinica.cser_id =  6;                        //SERVICIO NEGOCIO
                    this.historiaclinica.cpai_id =  1;                        //PAIS
                    this.historiaclinica.cubi_id = this.codUbigeo; //UBIGEO
                          this.historiaclinica.cmep_id = 0;                         //MEDICO PARTICULAR
                          this.historiaclinica.ctdo_id = 2;                         //TIPO DOCUMENTO
                          this.historiaclinica.cclt_id = parseInt(this.codCliente.toString()); //CLIENTE
                          this.historiaclinica.cdsn_id = 1;                         //DETALLE SERVICIO NEGOCIO
                          this.historiaclinica.estado = "0"; 
                          this.historiaclinica.prog = "Prg";
                          this.historiaclinica.codautorizacion = this.FormularioNuevoPacienteMad.value['txtCodigoAutorizacion']?.toString() || '';
                          this.historiaclinica.feclla = new Date();    //"2024-08-30";
                          this.historiaclinica.horlla = new Date();    //"2024-08-30T00:52:27.502Z";
                          this.historiaclinica.tiempo = 0; 
                          this.historiaclinica.fecate = new Date();
                          this.historiaclinica.horate = new Date();    //"2024-08-30T00:52:27.502Z";
                          this.historiaclinica.hrlledr = new Date();   //"2024-08-30T00:52:27.502Z";
                          this.historiaclinica.horoplla = new Date();  //"2024-08-30T00:52:27.502Z";
                          this.historiaclinica.fpago = "P";
                          this.historiaclinica.vip = "VIP";
                          this.historiaclinica.grupo = "--"
                          this.historiaclinica.cont = 0; 
                          this.historiaclinica.perfil = "CTRL";
                          this.historiaclinica.empresa = "WIN EMPRESAS";
                          this.historiaclinica.usuariocreacion = this.usuarioEnlinea.id || '';
                    //REGISTRAR HISTORIA CLINICA 
                    this._historiaclinicaService.addHistoriaClinicaMad(this.historiaclinica).subscribe({
                      next:(val:any)=> {
                        }
                    })
                    //REGISTRAR HISTORIA CLINICA - MEDIO COMUNICACION
                    if(this.vNumeroComunicacion == "1")
                    {
                      //INSERTAR 1
                      console.log(this.vNumeroComunicacion);
                    }
                    if(this.vNumeroComunicacion == "2")
                    {
                      //INSERTAR 2
                      console.log(this.vNumeroComunicacion);
                    }
                    if(this.vNumeroComunicacion == "3")
                    {
                      //INSERTAR 3
                      console.log(this.vNumeroComunicacion);
                    }
                    if(this.vNumeroComunicacion == "4")
                    {
                      //INSERTAR 4
                      console.log(this.vNumeroComunicacion);
                    }
                    if(this.vNumeroComunicacion == "5")
                    {
                      //INSERTAR 5
                      console.log(this.vNumeroComunicacion);
                    }
                    if(this.vNumeroComunicacion == "6")
                    {
                      //INSERTAR 6
                      console.log(this.vNumeroComunicacion);
                    }
                    //REGISTRAR CLINICA
                    this.direccion.id_persona = this.vId_Persona;
                    this.direccion.id_ubigeo = this.codUbigeo;
                    this.direccion.id_tipo_direccion = 1; //parseInt(this.FormularioNuevaDireccion.value["cboTipoDireccion"]?.toString() || '');
                    this.direccion.descripcion = this.FormularioNuevoPacienteMad.value["txtDireccion"]?.toString() || '';
                    this.direccion.anexo =   this.FormularioNuevoPacienteMad.value["txtTelefonofijo"]?.toString() || '';
                    this.direccion.celular = this.FormularioNuevoPacienteMad.value["txtTelefonoCelular"]?.toString() || '';
                    this.direccion.telefono_fijo = this.FormularioNuevoPacienteMad.value["txtTelefonofijo"]?.toString() || '';
                    this.direccion.nro_mz_lote = this.FormularioNuevoPacienteMad.value["txtNumero"]?.toString() || '';
                    this.direccion.urbanizacion = this.FormularioNuevoPacienteMad.value["txtUrbanizacion"]?.toString() || '';
                    this.direccion.referencia = this.FormularioNuevoPacienteMad.value["txtReferencia"]?.toString() || '';
                    this.direccion.dpto_interior = this.FormularioNuevoPacienteMad.value["txtInterior"]?.toString() || '';
                    this.direccion.usuario_creacion = this.usuarioEnlinea.id || '';
                    this._direccionService.addDireccion(this.direccion).subscribe({
                      next: (val: any) => {
                        this.vMensajeMad = "DESEA CREAR UNA FICHA DE ATENCION PARA EL PACIENTE";
                        this.vMensajePaciente = this.vPacienteCompleto + ' ' + "DE FORMA INMEDIATA";
                        this.vMensajeEspecialidad = "DE AGUDO CON LA ESPECIALIDAD DE GENERAL ?"
                        if(this.vMensajeMad != '')
                          {
                              const dialogRef =  this._dialog.open(MensajeComponent,
                              {
                                panelClass: `sanna_theme`,
                                data: 
                                { 
                                  'vMensaje': this.vMensajeMad,
                                  'vMensajePersona': this.vMensajePaciente,
                                  'vMensajeDoctor': this.vMensajeEspecialidad  
                                },  
                              }
                            );
                          }
                          this._dialogRef.close(true);
                      }
                    })    
                  }            
                    }
                    })
                },
                    error: (err: any) => {
                      console.error(err);
                    },
                  });
                }
            },
            error: console.log,
          });
      }
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios PRUEBA!');
    }
  }
//    ll_CodAte = DACODATE
//    !cod_ate = ll_CodAte
//    !cod_aso = DACODASO
//   
//    !estado = "1"
//    !cm_estado = "0"
//    !cod_estado = 0
//    !cm_orden = 0
//    !flg_cm_nueva = True
//    !cod_tit = Trim(txt_CodHia.text)
//    !fec_ate = lv_fecha
//    !Hor_ate = lv_hora
//    !edad_ate = Val(Txt_edad.text)
//    !cm_tlf_pac = Trim(Txt_tlf_casa.text)
//    !feclla_ate = Format(Date, "yyyy-mm-dd")
//    !horlla_ate = Format(Time, "HH:mm:ss")
//    !USULLA_ATE = Usuario
//    !cod_gru = Trim(Adata_seg.Recordset!cod_gru)
//    !nom_gru = Trim(Adata_seg.Recordset!nom_gru)
//    !cod_emp = s_CodEmp
//    !nom_emp = s_NomEmp
//    
//    !COD_ESP = Trim(Adata_esp.Recordset!COD_ESP)
//    !cod_dis = Trim(Adata_distrito.Recordset!cod_dis)
//    !des_dis = Trim(Adata_distrito.Recordset!des_dis)
//    !cod_prov = Trim(Adata_distrito.Recordset!cod_prov)
//    !des_prov = Trim(Adata_distrito.Recordset!provincia)
//    !dis_dir = Trim(Adata_distrito.Recordset!des_dis)
//    !ref_dir = PblFn_FORMATEAR_CADENA(Trim(Txt_referencia.text))
//    !cm_ref_dir = PblFn_FORMATEAR_CADENA(Trim(Txt_referencia.text))
//    !flag_programada = lv_programada
//    !f_soldoct = lv_SolDr
//    !f_prog = ls_tipo_prog
//    'pedrojesus
//     If Cbo_motivo_tipo_prog.Visible = True Then
//        !motivo_tipo_prog = Cbo_motivo_tipo_prog.ListIndex
//     End If
//     'pedrojesus
//    !obs_cm = Trim(Txt_obs_cm.text)
//    !cod_dr_solicitado = lv_cod_medico
//    !cm_appat_pac = ls_appat_pac
//    !cm_apmat_pac = ls_apmat_pac
//    !cm_nom_pac = ls_nom_pac
//    !nom_pac = ls_appat_pac & " " & ls_apmat_pac & " " & ls_nom_pac
//    !nom_tit = ls_appat_pac & " " & ls_apmat_pac & " " & ls_nom_pac
//    !pac_vip = Cbo_pac_VIP.text
//    !cod_dep = s_CodDep
//    !cm_directa = True
//    !flg_directo = "S"
//    !cm_datos_completos = True
//    
//'    If Frame_num_orden.Visible = True Then
//'        !numero_orden_delivery = Txt_Num_orden.Text
//'    End If
//       
//    !tlf_dir = Txt_tlf_casa.text
//    !cel_pac = Txt_tlf_celular.text
//
//    'FORMA DE PAGO
//   
//   If Cbo_Moneda.text = "S/." Then
//        !tar_ate = Val(Txt_ded.text)
//        !FLAGMONE = "S"
//        !CAMBIO = 0
//    Else
//        !tar_ate = Round(Val(Txt_ded.text) * lsg_cambio, 2)
//        !FLAGMONE = "D"
//        !CAMBIO = lsg_cambio
//    End If
//   
//    !coaseguro = Val(txt_coa.text)
//
//    Select Case Cbo_forma_pago.text
//    Case ""
//        !for_ate = ""
//        
//    Case "EFECTIVO"
//        !for_ate = "E"
//        
//        If Cbo_moneda_den.text = "S/." Then
//            !cm_moneda_den = "S"
//            !cm_den_cambio = 0
//        Else
//            !cm_moneda_den = "D"
//            !cm_den_cambio = lsg_cambio
//        End If
//        !cm_denominacion = Cbo_Denominacion.text
//        
//        
//    Case "CREDITO"
//        !for_ate = "C"
//        !cm_autorizado = Txt_autorizado.text
//        
//    Case "TARJETA"
//        !for_ate = "T"
//        !codtar_ate = TxtNroTar.text
//        !NTAR_ATE = Mid(ME_tarjeta.text & Space(16 - Len(ME_tarjeta.text)), 9, 8)
//        !tarj_mc = ME_tarjeta.text & Space(16 - Len(ME_tarjeta.text))
//        
//        If Txt_anio_credito.text <> "" And Txt_mes_credito.text <> "" Then
//            !FVENC_ATE = Txt_anio_credito.text & "/" & Txt_mes_credito.text & "/" & "01"
//        End If
//    
//    Case "MPOS"
//        !for_ate = "M"
//    
//    Case "TRANSFERENCIA"
//        !for_ate = "F"
//        
//    
//    Case "POS"
//        !for_ate = "P"
//        '!num_operacion_ap = Txt_numero_ap.Text
//    End Select
//
//    ll_cod_dir = REGISTRA_DIRECCION
//
//    !cod_dir = Format(ll_cod_dir, "00")
//    !des_dir = Mid(PblFn_FORMATEAR_CADENA(Trim(Txt_direccion.text) & " " & Trim(Txt_nro_lote.text) & " " & Trim(Txt_dpto_dir.text)), 1, 70)
//    !tlf_dir = Txt_tlf_casa.text
//    !cel_pac = Txt_tlf_celular.text
//    
//    !sexo_ate = IIf(Cbo_sexo.text = "FEMENINO", "F", "M")
//    !sin_ate = PblFn_FORMATEAR_CADENA(Trim(Txt_sintomas.text))
//    
//    !contacto_pac = Txt_contacto_pac.text
//    !contacto_aseg = Txt_contacto_aseg.text
//    
//    'datos de aseguradora
//    
//    'Actuales
//    !cod_aut_prestacion = Trim(TxtCodAut.text)
//    !cod_asegurado = Trim(Txt_cod_aseg.text)
//    !cod_solgen = Trim(Txt_num_sol.text)
//    !cm_aseg_producto = UCase(Trim(Txt_prod.text))
//    !poliza_asegurado = Trim(Txt_Poliza.text)
//    !poliza_certificado = Trim(Txt_pol_cert.text)
//    !tipo_afiliacion = Txt_cod_aseg.Tag
//    !cm_aseg_producto = Txt_prod.text
//     
//    
//    
//    If Cbo_pqt_nut.Visible = True Then
//        Select Case Cbo_pqt_nut.text
//            Case "PAQ. SIMPLE":
//                !id_paquete = 1
//            Case "PAQ. DOBLE":
//                !id_paquete = 2
//            Case "PAQ. FAMILIAR":
//                !id_paquete = 3
//            Case Else:
//                !id_paquete = 0
//        End Select
//    End If
//    
//   
//    
//    Select Case Cbo_tipo_consulta.text
//        Case "PRIMERA CONSULTA"
//            !primera_consulta = True
//        Case "CONSULTA SEGUIMIENTO"
//            !primera_consulta = False
//         Case "PACIENTE TRASLADO"
//            !primera_consulta = True
//            !paciente_traslado = True
//    End Select
//    
//    If Me.Tag = "PACASMAYO" Then
//        !clasificacion_pac = 63
//    Else
//        !clasificacion_pac = Val(DC_clasificacion.BoundText)
//    End If
//    
//    
//    'ASIGNAR SUB CLASIFICACION DE CRONICO
//        
//    'If Val(DC_clasificacion.BoundText) = 1 Then
//    '    !cod_subclasif = 4
//    'End If
//    
//    Select Case Val(DC_clasificacion.BoundText)
//        Case 1, 2, 200, 201, 202, 203, 24, 25, 110
//            !id_periodo_consulta = 1
//    End Select
//    
//    'PAPU 26/09/23 Registra PRIMERA ATENCIÓN O SEGUIMIENTO en el nuevo desplegable Tipo de Servicio
//'    If cboTipoServ.ListIndex = 0 Then
//'        !tipo_servicio = "ATE"
//'    ElseIf cboTipoServ.ListIndex = 1 Then
//'        !tipo_servicio = "SGC"
//'    End If
//
//    !tipo_servicio = "ATE"
//    !tipo_ate = Cbo_tipo.text
//    !flg_reprogramada = False
//    
//    !tipo_doc_pago = vt_tipo_doc_pago
//    !id_condicion_especial_pago = li_condicion_especial_pago
//    !descrp_zona = DCbo_zona_dist.text
//    
//    If fram_empresa.Visible = True Then
//        If Opt_emp_sunat.Value = True Then
//            !empresa_paciente = "SUNAT"
//        Else
//            !empresa_paciente = Trim(Txt_empresa.text)
//        End If
//    End If
//    
//    If Fram_medio_solicitud_ate.Visible = True Then
//        !id_mrp = Val(Dcbo_via_solicitud.BoundText)
//    End If
//    
//    'PAPU 25/01/2024
//    If Me.Tag = "PACASMAYO" Then
//        !cod_categoria_serv_cliente = 16
//    Else
//        !cod_categoria_serv_cliente = Val(Dcbo_categoria.BoundText)
//    End If
//    
//    !modo_atencion_medico = Val(Dcbo_medico_atiende.BoundText)
//        
//    'pedrojesus
//    If Txt_DNI_titular.Visible = True Then
//            !dni_titular = Txt_DNI_titular.text
//    End If


    //INICIO REGISTRAR HISTORIA CLINICA 




  }

