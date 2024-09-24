import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MotivoAtencionAmbulancia, PrioridadAmbulancia, Productos, Proveedores, TipoAmbulancia, TipoPoliza, TipoServicioAmbulancia, TipoTrasladoAmbulancia } from 'src/app/models/ambulancia.model';
import { Cliente } from 'src/app/models/cliente.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Parametro } from 'src/app/models/parametro.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { AmbulanciaService } from 'src/app/services/ambulancia.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CoreService } from 'src/app/services/core.service';
import { ParametroService } from 'src/app/services/parametro.service';
import { ListadoubigeosComponent } from '../../../sctr/components/sctr-listado-ubigeos/listado-ubigeos.component';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { AmbMantenimientoSedesComponent } from '../amb-mantenimiento-sedes/amb-mantenimiento-sedes.component';
import { SedeTraslado } from 'src/app/models/sedetraslado.model';
import { SedeTrasladoService } from 'src/app/services/sedetraslado.service';
import { AmbMantenimientoDireccionesComponent } from '../amb-mantenimiento-direcciones/amb-mantenimiento-direcciones.component';
import { limpiarLetras, limpiarNumero, primer9, rellenaCaracteres, soloDecimales, soloLetras, soloNumeros, validarEmail } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-amb-nueva-atencion',
  templateUrl: './amb-nueva-atencion.component.html',
  styleUrl: './amb-nueva-atencion.component.scss',
  providers:
    [
      {
        provide: MAT_DATE_LOCALE, useValue: 'es-PE'
      },
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})

export class AmbNuevaAtencionComponent implements OnInit {
  options = this.settings.getOptions();
  hoyFecha = new Date();
  //fechaEventoAdverso = this.convertDate(this.hoyFecha);
  frmNuevaAtencion: FormGroup;
  solicitudes: Parametro[];
  solicitudCallMedico: Parametro[];
  tiposServicios: TipoServicioAmbulancia[];
  prioridades: PrioridadAmbulancia[];
  tipoPoliza: TipoPoliza[];
  tiposAmbulancia: TipoAmbulancia[];
  tiposTrasladoAmbulancia: TipoTrasladoAmbulancia[];
  filteredOptionsTraslado: TipoTrasladoAmbulancia[];
  sedesTrasladoOrigen: SedeTraslado[];
  sedesTrasladoDestino: SedeTraslado[];
  filteredOptionsOrigen: SedeTraslado[];
  filteredOptionsDestino: SedeTraslado[];
  filteredOptionsProveedor: Proveedores[];
  motivosAtencionAmbulancia: MotivoAtencionAmbulancia[];
  productos: Productos[];
  proveedores: Proveedores[];
  clientes: Cliente[];
  solicitantes: Parametro[];
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  usuarioEnlinea: UsuarioAuth;
  datosPacienteSiteds: Paciente;
  valSolicitud: number = 0;
  traslado: number = 1;
  fuente: number = 1;
  origen: string = 'DOM';
  destino: string = 'DOM';
  tipoDeServicio: string = '';
  valProducto: string;
  formaPago: string;
  valCliente: number = 0;
  valTipoPoliza: number = 0;
  valAmbulanciaPlaya: boolean = false;
  valPacienteConflictivo: boolean = false;
  valFueraCobertura: boolean = false;
  valPlaca: boolean = false;
  valPoliza: boolean = false;
  valSiniestro: boolean = false;
  valTipoAmbulancia: number = 0;
  valTipoTrasladoAmbulancia: number = 0;
  codPaciente: number = 0;
  codTipoTraslado: number = 0;
  codMotivoAmbulancia: number = 0;
  codProveedor: number = 0;
  codProducto: number = 0;
  codOrigen: number = 0;
  codDestino: number = 0;
  valTipoServicio: string = '0';
  valPrioridad: string = '0';
  valSolicitante: number = 0;
  valCodClienteSiteds: number;
  rbInmediato: boolean = false;
  rbProgramado: boolean = false;
  rbSiteds: boolean = false;
  rbCitrix: boolean = false;
  rbTipoPoliza: boolean = false;
  _rbOrigenDomicilio: boolean = true;
  _rbOrigenOtros: boolean = false;
  _rbOrigenClinicaHospital: boolean = false;
  _rbDestinoDomicilio: boolean = true;
  _rbDestinoOtros: boolean = false;
  _rbDestinoClinicaHospital: boolean = false;
  showSpinner: boolean = false;
  statusBtnSiteds: boolean = true;
  codUbigeoOrigen: string;
  codUbigeoDestino: string;

  @ViewChild("cboTipoTraslado") cboTipoTraslado: ElementRef;
  @ViewChild("cboMotivoAtencion") cboMotivoAtencion: ElementRef;
  @ViewChild("txtAutorizado") txtAutorizado: ElementRef;
  @ViewChild("txtProducto") txtProducto: ElementRef;
  @ViewChild("txtNroPlaca") txtNroPlaca: ElementRef;
  @ViewChild("txtNroPoliza") txtNroPoliza: ElementRef;
  @ViewChild("txtObservacion") txtObservacion: ElementRef;

  constructor(private _dialog: MatDialog,
    private settings: CoreService,
    private dialogRef: MatDialogRef<AmbNuevaAtencionComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private _parametroService: ParametroService,
    private _ambulanciaService: AmbulanciaService,
    private _sedeTrasladoService: SedeTrasladoService,
    private _clienteService: ClienteService,
    private _historiaClinicaServices: HistoriaClinicaService) {
    this.datosPacienteSiteds = data;
  }

  ngOnInit() {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.tipoDeServicio = localStorage.getItem('tipoServicio') as string;
    this.getTipoSolicitudList();
    this.getSolicitudCallMedicoList();
    this.getTipoServicioList("I");
    this.getClientesList();
    this.getSolicitantesList();

    this.frmNuevaAtencion = this.fb.group({
      cboTipoServicio: ['', Validators.required],
      cboTipoAmbulancia: [{ value: '', disabled: true }, Validators.required],
      cboPrioridad: ['', Validators.required],
      cboTipoTraslado: [{ value: '', disabled: true }, Validators.required],
      cboCliente: ['', Validators.required],
      cboSolicitud: ['', Validators.required],
      cboMotivoAtencion: ['', Validators.required],
      cboProveedorEventoAdverso: [{ value: '', disabled: true }, Validators.required],
      cboDeducible: [{ value: '', disabled: true }, Validators.required],
      cboFormaPago: ['', Validators.required],
      cboTipoPoliza: [{ value: '', disabled: true }, Validators.required],
      cboSolicitado: [{ value: '', disabled: false }, Validators.required],
      cboClinicaHospitalOrigen: [{ value: '', disabled: true }, Validators.required],
      cboClinicaHospitalDestino: [{ value: '', disabled: true }, Validators.required],
      cboMonedaEfectivo: [{ value: '', disabled: true }, Validators.required],
      dtpFechaProgramado: [{ value: '', disabled: true }, Validators.required],
      dtpFechaEventoAdverso: [{ value: this.hoyFecha, disabled: true }, Validators.required],
      txtHoraProgramada: [{ value: '', disabled: true }, Validators.required],
      txtApellidoPaterno: [{ value: '', disabled: true }],
      txtApellidoMaterno: [{ value: '', disabled: true }],
      txtNombres: [{ value: '', disabled: true }],
      txtEdad: [{ value: '', disabled: true }],
      txtTipoDoc: [{ value: '', disabled: true }],
      txtNumDoc: [{ value: '', disabled: true }],
      txtAntecedente: [{ value: '', disabled: false }, Validators.required],
      txtAlergiaMedica: [{ value: '', disabled: false }, Validators.required],
      txtObservacion: [{ value: '', disabled: false }, Validators.required],
      txtDeducible: [{ value: '', disabled: true }],
      txtMonedaDeducible: [{ value: '', disabled: true }],
      txtCoaseguro: [{ value: '', disabled: false }, Validators.required],
      txtUbigeoOrigen: [{ value: '', disabled: true }, Validators.required],
      txtUbigeoDestino: [{ value: '', disabled: true }, Validators.required],
      txtDireccionOrigen: [{ value: '', disabled: false }, Validators.required],
      txtReferenciaOrigen: [{ value: '', disabled: false }, Validators.required],
      txtTelefonoMovil: [{ value: '', disabled: false }, Validators.required],
      txtTelefonoFijo: [{ value: '', disabled: false }, Validators.required],
      txtDireccionDestino: [{ value: '', disabled: true }, Validators.required],
      txtReferenciaDestino: [{ value: '', disabled: true }, Validators.required],
      txtCodAutorizacion: [{ value: '', disabled: true }],
      txtProducto: [{ value: '', disabled: true }, Validators.required],
      txtProductoSiteds: [{ value: '', disabled: true }],
      txtContratante: [{ value: '', disabled: true }, Validators.required],
      txtPoliza: [{ value: '', disabled: true }, Validators.required],
      txtCodAsegurado: [{ value: '', disabled: true }, Validators.required],
      txtAutorizado: [{ value: '', disabled: true }, Validators.required],
      txtNroPlaca: [{ value: '', disabled: true }, Validators.required],
      txtNroPoliza: [{ value: '', disabled: true }, Validators.required],
      txtNroSiniestro: [{ value: '', disabled: true }, Validators.required],
      txtUbiDentroClinicaOrigen: [{ value: '', disabled: true }, Validators.required],
      txtMontoEfectivo: [{ value: '', disabled: true }, Validators.required],
      chkAmbulanciaPlaya: [{ value: '', disabled: false }],
      chkFueraCobertura: [{ value: '', disabled: false }],
      chkPacienteConflictivo: [{ value: '', disabled: false }],
      rbFuenteDatos: [{ value: '1' }]
    });

  }

  getDatosSiteds() {
    if (this.datosPacienteSiteds) {
      //console.log(this.datosPacienteSiteds)
      if (this.datosPacienteSiteds["data"]["codAutorizacion"]) {
        this.valCodClienteSiteds = this.datosPacienteSiteds["data"]["codCliente"];
        this.frmNuevaAtencion.controls['cboCliente'].disable();
        this.codPaciente = this.datosPacienteSiteds["data"]["datosSiteds"]["id_paciente"];
        this.frmNuevaAtencion.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoPaternoTitular"]);
        this.frmNuevaAtencion.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoMaternoTitular"]);
        this.frmNuevaAtencion.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NombresTitular"]);
        this.frmNuevaAtencion.controls['txtNumDoc'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NumeroDocumentoTitular"]);
        this.frmNuevaAtencion.controls['txtTipoDoc'].setValue(this.datosPacienteSiteds["data"]["datosAsegurado"]["value"]["txtTipoDocPaciente"]);
        this.frmNuevaAtencion.controls['txtEdad'].setValue(this.datosPacienteSiteds["data"]["datosAsegurado"]["value"]["txtEdadPaciente"]);
        this.valProducto = this.datosPacienteSiteds["data"]["datosSiteds"]["DesProducto"];
        this.frmNuevaAtencion.controls['txtProductoSiteds'].setValue(this.valProducto);
        this.frmNuevaAtencion.controls['txtCodAutorizacion'].setValue(this.datosPacienteSiteds["data"]["codAutorizacion"]);
        this.frmNuevaAtencion.controls['txtContratante'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NombreContratante"]);
        this.frmNuevaAtencion.controls['txtPoliza'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NumeroPoliza"] + "-" + this.datosPacienteSiteds["data"]["datosSiteds"]["NumeroCertificado"]);
        this.frmNuevaAtencion.controls['txtCodAsegurado'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["CodigoAfiliado"]);
        this.frmNuevaAtencion.controls['txtDeducible'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["CodCopagoFijo"]);
        this.frmNuevaAtencion.controls['txtCoaseguro'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["CodCopagoVariable"]);
        if (this.datosPacienteSiteds["data"]["datosSiteds"]["CodMoneda"] == "1") {
          this.frmNuevaAtencion.controls['txtMonedaDeducible'].setValue("S/.");
        } else {
          this.frmNuevaAtencion.controls['txtMonedaDeducible'].setValue("$");
        }

        this.selectClienteCbo(null, this.valCodClienteSiteds);
      } else {
        this.codPaciente = this.datosPacienteSiteds["data"]["id_paciente"];
        this.frmNuevaAtencion.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_paterno"]);
        this.frmNuevaAtencion.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_materno"]);
        this.frmNuevaAtencion.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["nombres"]);
        this.frmNuevaAtencion.controls['txtTipoDoc'].setValue(this.datosPacienteSiteds["data"]["tipo_documento"]);
        this.frmNuevaAtencion.controls['txtNumDoc'].setValue(this.datosPacienteSiteds["data"]["numero_documento"]);
        this.frmNuevaAtencion.controls['txtTelefonoMovil'].setValue(this.datosPacienteSiteds["data"]["movil"]);
        this.frmNuevaAtencion.controls['txtEdad'].setValue(this.datosPacienteSiteds["data"]["edad"]);
      }
    }
  }

  getClientesList() {
    this._clienteService.GetClientesAmbulancia().subscribe({
      next: (res) => {
        this.clientes = res.resultData;
        if (this.datosPacienteSiteds) {
          this.getDatosSiteds();
        }
      },
      error: console.log,
    });
  }

  getTipoSolicitudList() {
    this._parametroService.GetParametro("6").subscribe({
      next: (res) => {
        this.solicitudes = res.resultData;
        this.valSolicitud = 1;
      },
      error: console.log,
    });
  }

  getSolicitudCallMedicoList() {
    this._parametroService.GetParametro("9").subscribe({
      next: (res) => {
        this.solicitudCallMedico = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoServicioList(tipoServicio: string) {
    this._ambulanciaService.GetTipoServicioAmbulancia(tipoServicio).subscribe({
      next: (res) => {
        this.tiposServicios = res.resultData;
        if (localStorage.getItem('eventoAdverso') == 'Si') {
          this.valTipoServicio = '1041';
          this.selectTipoServicioCbo(null, this.valTipoServicio);
        } else {
          this.valTipoServicio = '1025';
        }
        this.getPrioridadList(this.valTipoServicio);
      },
      error: console.log,
    });
  }

  getPrioridadList(tipoServicio: string) {
    this._ambulanciaService.GetPrioridadAmbulancia(tipoServicio).subscribe({
      next: (res) => {
        this.prioridades = res.resultData;
        for (let option_ of this.prioridades) {
          this.valPrioridad = option_.id;
          break;
        }
      },
      error: console.log,
    });
  }

  getTipoPolizaList(idCliente: number) {
    this._ambulanciaService.GetTipoPoliza(idCliente).subscribe({
      next: (res) => {
        this.tipoPoliza = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoAmbulanciaList() {
    this._ambulanciaService.GetTipoAmbulancia().subscribe({
      next: (res) => {
        this.rbInmediato = true;
        this.tiposAmbulancia = res.resultData;
        for (let option_ of this.tiposAmbulancia) {
          this.valTipoAmbulancia = option_.id;
          this.getTipoTrasladoAmbulancia(this.valTipoAmbulancia);
          break;
        }
      },
      error: console.log,
    });
  }

  getTipoTrasladoAmbulancia(tipoAmbulancia: number) {
    this._ambulanciaService.GetTipoTrasladoAmbulancia(tipoAmbulancia).subscribe({
      next: (res) => {
        this.tiposTrasladoAmbulancia = res.resultData;
        this.filteredOptionsTraslado = res.resultData;
        this.cboTipoTraslado.nativeElement.focus();
      },
      error: console.log,
    });
  }

  getTipoPolizaByCodigo(codPoliza: number) {
    this._ambulanciaService.GetTipoPolizaByCodigo(codPoliza).subscribe({
      next: (res) => {
        if (res.resultData) {
          this.valPlaca = res.resultData[0]['placa'];
          this.valPoliza = res.resultData[0]['poliza'];
          this.valSiniestro = res.resultData[0]['siniestro'];
          if (this.valPoliza == true) {
            this.txtNroPoliza.nativeElement.focus();
            if (this.valPlaca == true) {
              this.txtNroPlaca.nativeElement.focus();
            }
          }
          this.frmNuevaAtencion.controls['txtNroPlaca'].enable();
          this.frmNuevaAtencion.controls['txtNroPoliza'].enable();
          this.frmNuevaAtencion.controls['txtNroSiniestro'].enable();
          this.frmNuevaAtencion.controls['txtNroPlaca'].reset();
          this.frmNuevaAtencion.controls['txtNroPoliza'].reset();
          this.frmNuevaAtencion.controls['txtNroSiniestro'].reset();
        } else {
          this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
          this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
          this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
        }
      },
      error: console.log,
    });
  }

  getSolicitantesList() {
    this._parametroService.GetParametro("9").subscribe({
      next: (res) => {
        this.solicitantes = res.resultData;
        for (let option_ of this.solicitantes) {
          this.valSolicitante = option_.id;
          break;
        }
      },
      error: console.log,
    });
  }

  getMotivosAmbulanciaList(busqueda: string) {
    if (busqueda.length > 1) {
      this._ambulanciaService.GetMotivoAtencionAmbulancia(busqueda).subscribe({
        next: (res) => {
          this.motivosAtencionAmbulancia = res.resultData;
        },
        error: console.log,
      });
    }
  }

  getProductosList(busqueda: string, cliente: number) {
    if (busqueda.length > 1) {
      this._ambulanciaService.GetProductoAmbulancia(busqueda, cliente).subscribe({
        next: (res) => {
          this.productos = res.resultData;
        },
        error: console.log,
      });
    }
  }

  getSedeTrasladoList() {
    this._sedeTrasladoService.GetSedeTraslado().subscribe({
      next: (res) => {
        this.sedesTrasladoOrigen = res.resultData;
        this.filteredOptionsOrigen = res.resultData;
        this.sedesTrasladoDestino = res.resultData;
        this.filteredOptionsDestino = res.resultData;
      },
      error: console.log,
    });
  }

  getProovedorList() {
    this._ambulanciaService.GetProveedorAmbulancia().subscribe({
      next: (res) => {
        this.proveedores = res.resultData;
      },
      error: console.log,
    });
  }

  selectTipoServicioCbo(target: any, value) {
    if (value) {
      this.valTipoServicio = value;
    } else {
      this.valTipoServicio = target.value;
    }
    this.frmNuevaAtencion.reset();
    this.getDatosSiteds();
    if (this.valTipoServicio == '1030') {
      this.frmNuevaAtencion.controls['cboTipoAmbulancia'].enable();
      this.frmNuevaAtencion.controls['cboTipoTraslado'].enable();
      this.frmNuevaAtencion.controls['txtDireccionDestino'].enable();
      this.frmNuevaAtencion.controls['txtReferenciaDestino'].enable();
      this.frmNuevaAtencion.controls['cboTipoTraslado'].reset();
      this.frmNuevaAtencion.controls['cboPrioridad'].disable();
      this.frmNuevaAtencion.controls['cboProveedorEventoAdverso'].disable();
      this.getTipoAmbulanciaList();
    } else if (this.valTipoServicio == '1041') {
      this.frmNuevaAtencion.controls['cboProveedorEventoAdverso'].enable();
      this.frmNuevaAtencion.controls['cboProveedorEventoAdverso'].reset();
      this.getProovedorList();
      this.frmNuevaAtencion.controls['cboPrioridad'].enable();
      this.frmNuevaAtencion.controls['dtpFechaEventoAdverso'].enable();
      this.frmNuevaAtencion.controls['cboPrioridad'].reset();
      this.frmNuevaAtencion.controls['cboProveedorEventoAdverso'].disable();
      this.getPrioridadList(this.valTipoServicio);
    } else {
      this.frmNuevaAtencion.controls['cboPrioridad'].enable();
      this.frmNuevaAtencion.controls['cboPrioridad'].reset();
      this.frmNuevaAtencion.controls['cboProveedorEventoAdverso'].disable();
      this.getPrioridadList(this.valTipoServicio);
    }
  }

  selectTipoAmbulanciaCbo(target: any) {
    this.frmNuevaAtencion.controls['cboTipoTraslado'].reset();
    this.valTipoAmbulancia = target.value;
    this.getTipoTrasladoAmbulancia(this.valTipoAmbulancia);
  }

  selectClienteCbo(target: any, value) {
    this.valTipoPoliza = 0;
    if (value) {
      this.valCliente = parseInt(value);
    } else {
      this.valCliente = parseInt(target.value);
    }

    this.rbSiteds = false;
    this.rbCitrix = false;
    this.rbTipoPoliza = false;
    this.statusBtnSiteds = true;

    if (!value) {
      this.frmNuevaAtencion.controls['txtProducto'].reset();
      this.frmNuevaAtencion.controls['txtCodAutorizacion'].reset();
      this.frmNuevaAtencion.controls['txtContratante'].reset();
      this.frmNuevaAtencion.controls['txtPoliza'].reset();
      this.frmNuevaAtencion.controls['txtCodAsegurado'].reset();
      this.frmNuevaAtencion.controls['cboTipoPoliza'].reset();
      this.frmNuevaAtencion.controls['txtPoliza'].reset();
      this.frmNuevaAtencion.controls['txtAutorizado'].disable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
      this.frmNuevaAtencion.controls['txtProducto'].disable();
      this.frmNuevaAtencion.controls['txtContratante'].disable();
      this.frmNuevaAtencion.controls['txtCodAsegurado'].disable();
      this.frmNuevaAtencion.controls['cboTipoPoliza'].disable();
      this.frmNuevaAtencion.controls['txtPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
    }

    if (this.valCliente == 242) {
      this.rbSiteds = false;
      this.rbCitrix = false;
      this.rbTipoPoliza = false;
      this.statusBtnSiteds = true;
      this.frmNuevaAtencion.controls['txtAutorizado'].enable();
      this.txtAutorizado.nativeElement.focus();
    } else if (this.valCliente == 44) {
      this.rbSiteds = true;
      this.rbCitrix = false;
      this.rbTipoPoliza = false;
      this.statusBtnSiteds = false;
    } else if (this.valCliente == 106 || this.valCliente == 178) {
      this.rbSiteds = true;
      this.rbCitrix = false;
      this.rbTipoPoliza = false;
      this.statusBtnSiteds = false;
      this.getTipoPolizaList(this.valCliente);
    } else {
      this.rbSiteds = false;
      this.rbCitrix = false;
      this.rbTipoPoliza = false;
      this.statusBtnSiteds = true;
    }
  }

  selectPolizaCbo(target: any) {
    this.valTipoPoliza = parseInt(target.value);
    this.getTipoPolizaByCodigo(this.valTipoPoliza);
  }

  selectFormaPago(target: any) {
    this.formaPago = target.value;
    if (this.formaPago == 'E') {
      this.frmNuevaAtencion.controls['cboMonedaEfectivo'].enable();
      this.frmNuevaAtencion.controls['txtMontoEfectivo'].enable();
    } else {
      this.frmNuevaAtencion.controls['cboMonedaEfectivo'].disable();
      this.frmNuevaAtencion.controls['txtMontoEfectivo'].disable();
    }
  }

  displayLabelCliente(tipoTraslado: TipoTrasladoAmbulancia): string {
    return tipoTraslado && tipoTraslado.nombre ? tipoTraslado.nombre.trim() : '';
  }

  displayLabelMotivoAtencion(motivoAtencion: MotivoAtencionAmbulancia): string {
    return motivoAtencion && motivoAtencion.nombre ? motivoAtencion.nombre.trim() : '';
  }

  displayLabelProducto(producto: Productos): string {
    return producto && producto.nombre ? producto.nombre.trim() : '';
  }

  displayLabelProveedor(proveedor: Proveedores): string {
    return proveedor && proveedor.nombre ? proveedor.nombre.trim() : '';
  }

  displayLabelOrigen(origen: SedeTraslado): string {
    return origen && origen.nombre ? origen.nombre.trim() : '';
  }

  displayLabelDestino(destino: SedeTraslado): string {
    return destino && destino.nombre ? destino.nombre.trim() : '';
  }

  filterOptionTrasladosByLabel(options: TipoTrasladoAmbulancia[], label: string): TipoTrasladoAmbulancia[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: TipoTrasladoAmbulancia) => {
      return option.nombre.toLowerCase().includes(value);
    });
  }

  filterOptionOrigenByLabel(options: SedeTraslado[], label: string): SedeTraslado[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: SedeTraslado) => {
      return option.nombre.toLowerCase().includes(value);
    });
  }

  filterOptionProveedorByLabel(options: Proveedores[], label: string): Proveedores[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: Proveedores) => {
      return option.nombre.toLowerCase().includes(value);
    });
  }

  filterOptionDestinoByLabel(options: SedeTraslado[], label: string): SedeTraslado[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: SedeTraslado) => {
      return option.nombre.toLowerCase().includes(value);
    });
  }

  filterTraslado(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filteredOptionsTraslado = this.filterOptionTrasladosByLabel(this.tiposTrasladoAmbulancia, ds);
  }

  filterMotivo(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.getMotivosAmbulanciaList(ds);
  }

  filterProducto(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.getProductosList(ds, this.valCliente);
  }

  filterOrigen(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filteredOptionsOrigen = this.filterOptionOrigenByLabel(this.sedesTrasladoOrigen, ds);
  }

  filterDestino(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filteredOptionsDestino = this.filterOptionDestinoByLabel(this.sedesTrasladoDestino, ds);
  }

  filterProveedor(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filteredOptionsProveedor = this.filterOptionProveedorByLabel(this.proveedores, ds);
  }

  selectTipoTraslado(option: MatOption) {
    this.codTipoTraslado = parseInt(option.value.id);
  }

  selectMotivoAmbulancia(option: MatOption) {
    this.codMotivoAmbulancia = parseInt(option.value.id);
    this.txtObservacion.nativeElement.focus();
  }

  selectProveedor(option: MatOption) {
    this.codProveedor = parseInt(option.value.id);
  }

  selectProductoAmbulancia(option: MatOption) {
    this.codProducto = parseInt(option.value.id);
    this.valProducto = option.value.nombre;
  }

  selectOrigenAmbulancia(option: MatOption) {
    this.codOrigen = parseInt(option.value.id);
    for (let origen of this.filteredOptionsOrigen) {
      if (origen.id == this.codOrigen.toString()) {
        this.codUbigeoOrigen = origen.ubigeo;
        this.frmNuevaAtencion.controls['txtDireccionOrigen'].setValue(origen.direccion);
        this.frmNuevaAtencion.controls['txtReferenciaOrigen'].setValue(origen.referencia);
        this.frmNuevaAtencion.controls['txtUbigeoOrigen'].setValue(origen.departamento + ' - ' + origen.provincia + ' - ' + origen.distrito);
      }
    }
  }

  selectDestinoAmbulancia(option: MatOption) {
    this.codDestino = parseInt(option.value.id);
    for (let destino of this.filteredOptionsDestino) {
      if (destino.id == this.codDestino.toString()) {
        this.codUbigeoDestino = destino.ubigeo;
        this.frmNuevaAtencion.controls['txtDireccionDestino'].setValue(destino.direccion);
        this.frmNuevaAtencion.controls['txtReferenciaDestino'].setValue(destino.referencia);
        this.frmNuevaAtencion.controls['txtUbigeoDestino'].setValue(destino.departamento + ' - ' + destino.provincia + ' - ' + destino.distrito);
      }
    }
  }

  getTraslado(target: any) {
    this.traslado = target.value;
    this.frmNuevaAtencion.controls['dtpFechaProgramado'].reset();
    this.frmNuevaAtencion.controls['txtHoraProgramada'].reset();
    if (this.traslado == 1) {
      this.frmNuevaAtencion.controls['dtpFechaProgramado'].disable();
      this.frmNuevaAtencion.controls['txtHoraProgramada'].disable();
    } else {
      this.hoyFecha = new Date();
      this.frmNuevaAtencion.controls['dtpFechaProgramado'].enable();
      this.frmNuevaAtencion.controls['txtHoraProgramada'].enable();
      this.frmNuevaAtencion.controls['dtpFechaProgramado'].setValue(this.hoyFecha);
      let now = this.hoyFecha;
      let hours = ("0" + now.getHours()).slice(-2);
      let minutes = ("0" + now.getMinutes()).slice(-2);
      this.frmNuevaAtencion.controls['txtHoraProgramada'].setValue(hours + ':' + minutes);
    }
  }

  getFuenteDatos(target: any) {
    this.fuente = target.value;
    this.frmNuevaAtencion.controls['txtProducto'].reset();
    this.frmNuevaAtencion.controls['txtCodAutorizacion'].reset();
    this.frmNuevaAtencion.controls['txtContratante'].reset();
    this.frmNuevaAtencion.controls['txtPoliza'].reset();
    this.frmNuevaAtencion.controls['txtCodAsegurado'].reset();
    this.frmNuevaAtencion.controls['cboTipoPoliza'].reset();
    this.frmNuevaAtencion.controls['txtNroPlaca'].reset();
    this.frmNuevaAtencion.controls['txtNroPoliza'].reset();
    this.frmNuevaAtencion.controls['txtNroSiniestro'].reset();
    this.frmNuevaAtencion.controls['cboTipoPoliza'].disable();
    this.frmNuevaAtencion.controls['txtPoliza'].disable();
    this.statusBtnSiteds = true;
    if (this.fuente == 1) {
      this.frmNuevaAtencion.controls['txtProducto'].disable();
      this.frmNuevaAtencion.controls['txtContratante'].disable();
      this.frmNuevaAtencion.controls['txtCodAsegurado'].disable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
      this.statusBtnSiteds = false;
    } else if (this.fuente == 2) {
      this.frmNuevaAtencion.controls['txtProducto'].enable();
      this.frmNuevaAtencion.controls['txtContratante'].enable();
      this.frmNuevaAtencion.controls['txtCodAsegurado'].enable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
      if (this.valCliente == 106) {
        this.frmNuevaAtencion.controls['txtPoliza'].enable();
      } else {
        this.frmNuevaAtencion.controls['txtPoliza'].disable();
      }
      this.txtProducto.nativeElement.focus();
    } else {
      this.frmNuevaAtencion.controls['cboTipoPoliza'].enable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].enable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].enable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].enable();
      this.frmNuevaAtencion.controls['txtProducto'].disable();
      this.frmNuevaAtencion.controls['txtContratante'].disable();
      this.frmNuevaAtencion.controls['txtCodAsegurado'].disable();
    }
  }

  getOrigen(target: any) {
    this.origen = target.value;
    this.frmNuevaAtencion.controls['cboClinicaHospitalOrigen'].enable();
    this.frmNuevaAtencion.controls['txtUbiDentroClinicaOrigen'].enable();
    this.getSedeTrasladoList();
  }

  getDestino(target: any) {
    this.destino = target.value;
    this.frmNuevaAtencion.controls['cboClinicaHospitalDestino'].enable();
    this.getSedeTrasladoList();
  }

  activarAmbulanciaPlaya(event: MatCheckboxChange): void {
    if (event.checked) {
      this.valAmbulanciaPlaya = true;
    } else {
      this.valAmbulanciaPlaya = false;
    }
  }

  activarPacienteConflictivo(event: MatCheckboxChange): void {
    if (event.checked) {
      this.valPacienteConflictivo = true;
    } else {
      this.valPacienteConflictivo = false;
    }
  }

  activarFueraCobertura(event: MatCheckboxChange): void {
    if (event.checked) {
      this.valFueraCobertura = true;
    } else {
      this.valFueraCobertura = false;
    }
  }

  convertDate(valueDate) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(valueDate)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }

  openUbigeoOrigen() {
    const dialogRef = this._dialog.open(ListadoubigeosComponent, {
      disableClose: true,
      panelClass: 'sanna_theme',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.codUbigeoOrigen = result.data.codigo;
        this.frmNuevaAtencion.controls['txtUbigeoOrigen'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
      } else {
        this.toastrService.warning('¡Por favor seleccione un Ubigeo de origen!');
      }
    });
  }

  openUbigeoDestino() {
    const dialogRef = this._dialog.open(ListadoubigeosComponent, {
      disableClose: true,
      panelClass: 'sanna_theme',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.codUbigeoDestino = result.data.codigo;
        this.frmNuevaAtencion.controls['txtUbigeoDestino'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
      } else {
        this.toastrService.warning('¡Por favor seleccione un Ubigeo de destino!');
      }
    });
  }

  guardarAtencion() {
    this.showSpinner = true;

    this.historiaClinica.id_empresa = this.valCliente;//OK
    this.historiaClinica.id_persona = this.codPaciente;//POR VALIDAR
    //this.historiaClinica.SHIS_NOM_EMP = '';
    this.historiaClinica.NHIS_EDAD_ATE = this.frmNuevaAtencion.get('txtEdad')?.value;//OK
    this.historiaClinica.SHIS_CEL_PAC = this.frmNuevaAtencion.get('txtTelefonoMovil')?.value;//OK
    this.historiaClinica.SHIS_CM_REF_DIR = this.frmNuevaAtencion.get('txtReferenciaOrigen')?.value;//OK
    this.historiaClinica.NHIS_COD_TARIFA = 0;//OK
    this.historiaClinica.SHIS_F_PROG = this.tipoDeServicio;//OK
    this.historiaClinica.SHIS_COD_TIPO_PROG = this.tipoDeServicio;//OK
    this.historiaClinica.SHIS_COD_AMB_TIPO_SERV = this.valTipoServicio;//OK
    this.historiaClinica.SHIS_TIPO_SERVAMB_DRMAS = this.valTipoServicio;//OK
    let flg_programda = false;
    if (this.tipoDeServicio == 'I') {
      flg_programda = false;
    } else if (this.tipoDeServicio == 'P') {
      flg_programda = true;
    }
    this.historiaClinica.FHIS_FLAG_PROGRAMADA = flg_programda;//OK
    this.historiaClinica.SHIS_PERSONAL_CONTACTO = '';//OK
    let now = this.hoyFecha;
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    this.historiaClinica.DHIS_FEC_ATE = this.convertDate(this.hoyFecha);//OK
    this.historiaClinica.DHIS_HOR_ATE = hours + ':' + minutes;//OK
    //this.historiaClinica.SHIS_COD_EMP = '';
    this.historiaClinica.SHIS_AMB_COD_DIS_ORIGEN = this.codUbigeoOrigen;//OK
    this.historiaClinica.SHIS_AMB_DES_DIS_ORIGEN = this.frmNuevaAtencion.get('txtUbigeoOrigen')?.value;//OK
    this.historiaClinica.SHIS_AMB_DIR_ORIGEN = this.frmNuevaAtencion.get('txtDireccionOrigen')?.value;//OK
    this.historiaClinica.SHIS_AMB_REF_DIR_ORIGEN = this.frmNuevaAtencion.get('txtReferenciaOrigen')?.value;//OK
    if (this.traslado == 1) {
      //inmediato
      this.historiaClinica.DHIS_AMB_FECHA_INI = this.convertDate(this.hoyFecha);//OK
      this.historiaClinica.DHIS_AMB_HORA_INI = hours + ':' + minutes;//OK
    } else if (this.traslado == 2) {
      //programado
      this.historiaClinica.DHIS_AMB_FECHA_INI = this.convertDate(this.frmNuevaAtencion.get('dtpFechaProgramado')?.value);//OK
      this.historiaClinica.DHIS_AMB_HORA_INI = this.frmNuevaAtencion.get('txtHoraProgramada')?.value;//OK
    }
    //this.historiaClinica.DHIS_AMB_FECHA_FIN = '';
    //this.historiaClinica.DHIS_AMB_HORA_FIN = '';
    this.historiaClinica.SHIS_AMB_COD_DIS_DESTINO = this.codUbigeoDestino;//OK
    this.historiaClinica.SHIS_AMB_DES_DIS_DESTINO = this.frmNuevaAtencion.get('txtUbigeoDestino')?.value;//OK
    this.historiaClinica.SHIS_AMB_DIR_DESTINO = this.frmNuevaAtencion.get('txtDireccionDestino')?.value;//OK
    this.historiaClinica.SHIS_AMB_REF_DIR_DESTINO = this.frmNuevaAtencion.get('txtReferenciaDestino')?.value;//OK
    this.historiaClinica.SHIS_TIPO_SERVICIO = 'XXXX';//OK
    this.historiaClinica.NHIS_COD_PRIORIDAD_CALLMED = this.frmNuevaAtencion.get('cboPrioridad')?.value;//OK
    this.historiaClinica.NHIS_COD_MOTIVO_ATE_CALLMED = this.codMotivoAmbulancia;//OK
    this.historiaClinica.NHIS_TAR_ATE = this.frmNuevaAtencion.get('txtDeducible')?.value || 0;//OK
    this.historiaClinica.NHIS_COASEGURO = this.frmNuevaAtencion.get('txtCoaseguro')?.value;//OK
    this.historiaClinica.SHIS_TIPO_DOC_PAGO = '';//VALOR NO DETECTADO
    this.historiaClinica.observacion = this.frmNuevaAtencion.get('txtObservacion')?.value;//OK
    this.historiaClinica.SHIS_CM_DENOMINACION = this.frmNuevaAtencion.get('txtMontoEfectivo')?.value;//OK
    this.historiaClinica.SHIS_FOR_ATE = this.formaPago;//OK
    if (this.traslado == 1 || this.traslado == 2) {
      this.historiaClinica.NHIS_ID_TIPO_TRASLADO_CALLMED = this.frmNuevaAtencion.get('cboTipoTraslado0')?.value || 0;//OK
    }
    this.historiaClinica.SHIS_COD_AUT_PRESTACION = this.frmNuevaAtencion.get('txtCodAutorizacion')?.value;//OK
    this.historiaClinica.SHIS_CONTRATANTE_CITRIX = this.frmNuevaAtencion.get('txtContratante')?.value;//OK
    this.historiaClinica.SHIS_COD_ASEGURADO = this.frmNuevaAtencion.get('txtCodAsegurado')?.value;//OK
    this.historiaClinica.SHIS_CM_ASEG_PRODUCTO = this.valProducto;//POR VALIDAR
    /*if (this.valProducto) {
      this.historiaClinica.SHIS_CM_ASEG_PRODUCTO = this.valProducto;//OK
    } else {
      this.historiaClinica.SHIS_CM_ASEG_PRODUCTO = this.codProducto.toString(); //this.frmNuevaAtencion.get('txtProductoSiteds')?.value;
    }*/
    let serie_numero_poliza = '';
    if (this.frmNuevaAtencion.get('txtPoliza')?.value) {
      serie_numero_poliza = this.frmNuevaAtencion.get('txtPoliza')?.value.split("-");
    }
    this.historiaClinica.SHIS_POLIZA_ASEGURADO = serie_numero_poliza[0];//OK      
    this.historiaClinica.SHIS_POLIZA_CERTIFICADO = serie_numero_poliza[1];//OK      
    this.historiaClinica.FPAC_FLG_CONFLICTIVO_CALLMED = this.valPacienteConflictivo;//OK
    this.historiaClinica.FHIS_AMB_SERVICIO_PLAYA = this.valAmbulanciaPlaya;//OK
    this.historiaClinica.FHIS_FUERA_COBERTURA = this.valFueraCobertura;//OK
    this.historiaClinica.SHIS_DIRECCION_ORIGEN = this.origen;//OK
    this.historiaClinica.SHIS_DIRECCION_DESTINO = this.destino;//OK
    this.historiaClinica.CCLI_ID_ORIGEN = this.codOrigen;//OK
    this.historiaClinica.CCLI_ID_DESTINO = this.codDestino;//OK
    this.historiaClinica.SHIS_ALERGIA_MEDICA = this.frmNuevaAtencion.get('txtAlergiaMedica')?.value;//OK
    this.historiaClinica.SHIS_ATENCEDENTE = this.frmNuevaAtencion.get('txtAntecedente')?.value;//OK
    this.historiaClinica.CTAM_ID = this.valTipoAmbulancia;//OK
    this.historiaClinica.SHIS_RUC_EVENTO = '';//POR CONSULTAR
    this.historiaClinica.SHIS_RAZON_SOCIAL_EVENTO = '';//POR CONSULTAR
    this.historiaClinica.CPOL_ID = this.valTipoPoliza;//OK
    this.historiaClinica.SHIS_NRO_PLACA = this.frmNuevaAtencion.get('txtNroPlaca')?.value;//OK
    this.historiaClinica.SHIS_NRO_POLIZA = this.frmNuevaAtencion.get('txtNroPoliza')?.value;//OK
    this.historiaClinica.SHIS_SINIESTRO = this.frmNuevaAtencion.get('txtNroSiniestro')?.value;//OK
    this.historiaClinica.SHIS_AHUTORIZA_CORTESIA = this.frmNuevaAtencion.get('txtAutorizado')?.value;//OK
    this.historiaClinica.SHIS_REGLA_ORO = '';//POR CONSULTAR
    this.historiaClinica.FHIS_AMB_RESPIRATORIA = false;//OK
    this.historiaClinica.CPAR_ID_SOLICITANTE = this.frmNuevaAtencion.get('cboSolicitado')?.value;//OK
    this.historiaClinica.SHIS_UBIC_DENTRO_CLINICA_ORIGEN = this.frmNuevaAtencion.get('txtUbiDentroClinicaOrigen')?.value || '';//OK
    this.historiaClinica.SHIS_UBIC_DENTRO_CLINICA_DESTINO = '';//POR CONSULTAR
    this.historiaClinica.NPRV_ID = this.codProveedor;//OK
    if (this.frmNuevaAtencion.get('dtpFechaEventoAdverso')?.value) {
      this.historiaClinica.DHIS_FECHA_EVENTO_ADVERSO = this.convertDate(this.frmNuevaAtencion.get('dtpFechaEventoAdverso')?.value.toString()) || '';//OK
    }
    this.historiaClinica.CPAR_ID_SOLICITUD = this.valSolicitud;//OK
    this.historiaClinica.FHIS_CITRIX = false;//OK
    //this.historiaClinica.SHIS_USULLA_ATE = '';
    this.historiaClinica.estado = 1;//OK
    this.historiaClinica.SHIS_CM_ESTADO = '0';//OK
    this.historiaClinica.NHIS_COD_ESTADO = 0;//OK
    this.historiaClinica.NHIS_CM_ORDEN = 0;//OK
    this.historiaClinica.FHIS_FLG_CM_NUEVA = true;//OK
    this.historiaClinica.SHIS_COD_DR_SOLICITADO = '';//OK
    this.historiaClinica.FHIS_CM_DIRECTA = true;//OK
    this.historiaClinica.SHIS_FLG_DIRECTO = 'S';//OK
    this.historiaClinica.FHIS_CM_DATOS_COMPLETOS = true;//OK
    this.historiaClinica.SHIS_FLAGMONE = 'S';//OK
    this.historiaClinica.NHIS_CAMBIO = 0;//OK
    this.historiaClinica.SHIS_CM_MONEDA_DEN = 'S';//OK
    this.historiaClinica.NHIS_CM_DEN_CAMBIO = 0;//OK
    this.historiaClinica.SHIS_CONTACTO_PAC = '';//OK
    this.historiaClinica.SHIS_CONTACTO_ASEG = '';//OK
    this.historiaClinica.NHIS_CLASIFICACION_PAC = 26;//OK
    this.historiaClinica.SHIS_DESCRP_ZONA = '';//OK
    this.historiaClinica.NHIS_CLASIFICACION_PAC_CALLMED = 26;//OK
    this.historiaClinica.usuario_creacion = this.usuarioEnlinea.id || '';//OK

    //console.log(this.historiaClinica)
    //console.log(this.frmNuevaAtencion)
    if (this.frmNuevaAtencion.valid) {
      this.showSpinner = false;
      this._historiaClinicaServices.addHistoriaClinicaAmbulancia(this.historiaClinica).subscribe({
        next: (res: any) => {
          if (res.resultData.cod_historia_clinica == 0) {
            this.showSpinner = false;
            this.toastrService.error('¡No se pudo registrar la atención!', 'Atención', { timeOut: 3000 });
          } else {
            this.showSpinner = false;
            this.toastrService.success('¡Se ha creado la atención N° ' + res.resultData.cod_historia_clinica + ' de forma satisfactoria.', undefined, { timeOut: 5000 });
          }
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    } else {
      this.validateAllFormFields(this.frmNuevaAtencion);
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
      this.showSpinner = false;
    }
  }

  salir() {
    this.dialogRef.close(true);
  }

  openMantSedeDialog() {
    const dialogRef = this._dialog.open(AmbMantenimientoSedesComponent, {
      panelClass: 'sanna_theme',
      width: '620px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getSedeTrasladoList();
    });
  }

  openDireccionOrigenDialog() {
    if (this.codPaciente != 0) {
      const dialogRef = this._dialog.open(AmbMantenimientoDireccionesComponent,
        {
          panelClass: `sanna_theme`,
          width: '630px',
          data: { 'id_persona': this.codPaciente },
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          this.codUbigeoOrigen = result.data.id_ubigeo;
          this.frmNuevaAtencion.controls['txtUbigeoOrigen'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
          this.frmNuevaAtencion.controls['txtDireccionOrigen'].setValue(result.data.descripcion);
          this.frmNuevaAtencion.controls['txtReferenciaOrigen'].setValue(result.data.referencia);
        } else {
          this.toastrService.warning('¡Por favor seleccione una dirección de origen!');
        }
      });
    } else {
      this.toastrService.warning('¡Por favor seleccione una dirección de origen!');
    }
  }

  openDireccionDestinoDialog() {
    if (this.codPaciente != 0) {
      const dialogRef = this._dialog.open(AmbMantenimientoDireccionesComponent,
        {
          panelClass: `sanna_theme`,
          width: '630px',
          data: { 'id_persona': this.codPaciente },
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result.data) {
          this.codUbigeoDestino = result.data.id_ubigeo;
          this.frmNuevaAtencion.controls['txtUbigeoDestino'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
          this.frmNuevaAtencion.controls['txtDireccionDestino'].setValue(result.data.descripcion);
          this.frmNuevaAtencion.controls['txtReferenciaDestino'].setValue(result.data.referencia);
        } else {
          this.toastrService.warning('¡Por favor seleccione una dirección de destino!');
        }
      });
    } else {
      this.toastrService.warning('¡Por favor seleccione una dirección de destino!');
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  soloNumeros(event: Event): boolean {
    return soloNumeros(event);
  }

  soloDecimales(event: Event): boolean {
    return soloDecimales(event);
  }

  soloLetras(event: Event): boolean {
    return soloLetras(event);
  }

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

  limpiarLetras(event: Event): boolean {
    return limpiarLetras(event);
  }

  rellenaCaracteres(event: Event): boolean {
    return rellenaCaracteres(event);
  }

  primer9(event: Event): boolean {
    return primer9(event);
  }

  validarEmail(event: Event): boolean {
    return validarEmail(event);
  }

}