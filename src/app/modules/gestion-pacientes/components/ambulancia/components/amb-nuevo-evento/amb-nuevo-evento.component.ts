import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Proveedores, TipoAmbulancia, TipoComprobante, TipoPoliza, TipoServicioAmbulancia, TipoTrasladoAmbulancia } from 'src/app/models/ambulancia.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Parametro } from 'src/app/models/parametro.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { AmbulanciaService } from 'src/app/services/ambulancia.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CoreService } from 'src/app/services/core.service';
import { ParametroService } from 'src/app/services/parametro.service';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { SedeTraslado } from 'src/app/models/sedetraslado.model';
import { AmbMantenimientoDireccionesComponent } from '../amb-mantenimiento-direcciones/amb-mantenimiento-direcciones.component';
import { limpiarLetras, limpiarNumero, primer9, rellenaCaracteres, soloDecimales, soloLetras, soloNumeros, validarEmail } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-amb-nuevo-evento',
  templateUrl: './amb-nuevo-evento.component.html',
  styleUrl: './amb-nuevo-evento.component.scss'
})
export class AmbNuevoEventoComponent implements OnInit {
  options = this.settings.getOptions();
  hoyFecha = new Date();
  frmNuevaAtencion: FormGroup;
  solicitudes: Parametro[];
  tiposComprobante: TipoComprobante[];
  tiposServicios: TipoServicioAmbulancia[];
  tipoPoliza: TipoPoliza[];
  tiposAmbulancia: TipoAmbulancia[];
  solicitantes: Parametro[];
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  usuarioEnlinea: UsuarioAuth;
  datosPacienteSiteds: Paciente;
  valSolicitud: number = 0;
  valTipoComprobante: number = 0;
  fuente: number = 1;
  tipoDeServicio: string = '';
  formaPago: string;
  valAmbulanciaPlaya: boolean = false;
  valPacienteConflictivo: boolean = false;
  valFueraCobertura: boolean = false;
  valTipoAmbulancia: number = 0;
  valTipoTrasladoAmbulancia: number = 0;
  codPaciente: number = 0;
  codTipoTraslado: number = 0;
  valTipoServicio: string = '0';
  valSolicitante: number = 0;
  showSpinner: boolean = false;
  codUbigeoOrigen: string;

  constructor(private _dialog: MatDialog,
    private settings: CoreService,
    private dialogRef: MatDialogRef<AmbNuevoEventoComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private _parametroService: ParametroService,
    private _ambulanciaService: AmbulanciaService,
    private _clienteService: ClienteService,
    private _historiaClinicaServices: HistoriaClinicaService) {
    this.datosPacienteSiteds = data;
  }

  ngOnInit() {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.tipoDeServicio = localStorage.getItem('tipoServicio') as string;

    this.frmNuevaAtencion = this.fb.group({
      cboTipoServicio: ['', Validators.required],
      cboTipoAmbulancia: [{ value: '', disabled: false }, Validators.required],
      cboSolicitud: ['', Validators.required],
      cboFormaPago: ['', Validators.required],
      cboSolicitado: [{ value: '', disabled: false }, Validators.required],
      cboMonedaEfectivo: [{ value: '', disabled: true }, Validators.required],
      cboTipoComprobate: [{ value: '', disabled: false }, Validators.required],
      txtApellidoPaterno: [{ value: '', disabled: false }, Validators.required],
      txtApellidoMaterno: [{ value: '', disabled: false }, Validators.required],
      txtNombres: [{ value: '', disabled: false }, Validators.required],
      txtEmail: [{ value: '', disabled: false }],
      txtEmpresa: [{ value: '', disabled: false }],
      txtDeducible: [{ value: '', disabled: true }],
      txtMonedaDeducible: [{ value: '', disabled: true }],
      txtCoaseguro: [{ value: '', disabled: false }, Validators.required],
      txtUbigeoOrigen: [{ value: '', disabled: true }],
      txtDireccionOrigen: [{ value: '', disabled: false }, Validators.required],
      txtReferenciaOrigen: [{ value: '', disabled: false }, Validators.required],
      txtTelefonoMovil: [{ value: '', disabled: false }, Validators.required],
      txtTelefonoFijo: [{ value: '', disabled: false }],
      txtRuc: [{ value: '', disabled: false }, Validators.required],
      txtRazonsocial: [{ value: '', disabled: false }, Validators.required],
      txtDireccionFiscal: [{ value: '', disabled: false }, Validators.required],
      txtMontoEfectivo: [{ value: '', disabled: true }, Validators.required],
      chkAmbulanciaPlaya: [{ value: '', disabled: false }],
      chkFueraCobertura: [{ value: '', disabled: false }]
    });

    this.getTipoSolicitudList();
    this.getTipoComprobanteList();
    this.getTipoServicioList("P");
    this.getSolicitantesList();

    this.getTipoAmbulanciaList();
    this.getDatosSiteds();
  }

  getDatosSiteds() {
    if (this.datosPacienteSiteds) {
      //console.log(this.datosPacienteSiteds)
      if (this.datosPacienteSiteds["data"]["codAutorizacion"]) {
        this.codPaciente = this.datosPacienteSiteds["data"]["datosSiteds"]["id_paciente"];
        this.frmNuevaAtencion.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoPaternoTitular"]);
        this.frmNuevaAtencion.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoMaternoTitular"]);
        this.frmNuevaAtencion.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NombresTitular"]);
        this.frmNuevaAtencion.controls['txtDeducible'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["CodCopagoFijo"]);
        this.frmNuevaAtencion.controls['txtCoaseguro'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["CodCopagoVariable"]);
        if (this.datosPacienteSiteds["data"]["datosSiteds"]["CodMoneda"] == "1") {
          this.frmNuevaAtencion.controls['txtMonedaDeducible'].setValue("S/.");
        } else {
          this.frmNuevaAtencion.controls['txtMonedaDeducible'].setValue("$");
        }
      } else {
        this.codPaciente = this.datosPacienteSiteds["data"]["id_paciente"];
        this.frmNuevaAtencion.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_paterno"]);
        this.frmNuevaAtencion.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_materno"]);
        this.frmNuevaAtencion.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["nombres"]);
        this.frmNuevaAtencion.controls['txtTelefonoMovil'].setValue(this.datosPacienteSiteds["data"]["movil"]);
      }
    }
  }

  getTipoComprobanteList() {
    this._ambulanciaService.GetTipoComprobante().subscribe({
      next: (res) => {
        this.tiposComprobante = res.resultData;
        this.valTipoComprobante = 1;
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

  getTipoServicioList(tipoServicio: string) {
    this._ambulanciaService.GetTipoServicioAmbulancia(tipoServicio).subscribe({
      next: (res) => {
        this.tiposServicios = res.resultData;
        this.valTipoServicio = '1040';
      },
      error: console.log,
    });
  }

  getTipoAmbulanciaList() {
    this._ambulanciaService.GetTipoAmbulancia().subscribe({
      next: (res) => {
        this.tiposAmbulancia = res.resultData;
        for (let option_ of this.tiposAmbulancia) {
          this.valTipoAmbulancia = option_.id;
          break;
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

  selectTipoAmbulanciaCbo(target: any) {
    this.valTipoAmbulancia = target.value;
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

  getTipoComprobanteCbo(target: any) {
    this.valTipoComprobante = target.value;
  }

  displayLabelCliente(tipoTraslado: TipoTrasladoAmbulancia): string {
    return tipoTraslado && tipoTraslado.nombre ? tipoTraslado.nombre.trim() : '';
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

  getFuenteDatos(target: any) {
    this.fuente = target.value;
    this.frmNuevaAtencion.controls['cboTipoPoliza'].reset();
    this.frmNuevaAtencion.controls['txtNroPlaca'].reset();
    this.frmNuevaAtencion.controls['txtNroPoliza'].reset();
    this.frmNuevaAtencion.controls['txtNroSiniestro'].reset();
    this.frmNuevaAtencion.controls['cboTipoPoliza'].disable();
    if (this.fuente == 1) {
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
    } else if (this.fuente == 2) {
      this.frmNuevaAtencion.controls['txtNroPlaca'].disable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].disable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].disable();
    } else {
      this.frmNuevaAtencion.controls['cboTipoPoliza'].enable();
      this.frmNuevaAtencion.controls['txtNroPlaca'].enable();
      this.frmNuevaAtencion.controls['txtNroPoliza'].enable();
      this.frmNuevaAtencion.controls['txtNroSiniestro'].enable();
    }
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

  guardarAtencion() {
    this.showSpinner = true;

    this.historiaClinica.id_persona = this.codPaciente;//POR VALIDAR
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
    this.historiaClinica.SHIS_PERSONAL_CONTACTO = this.frmNuevaAtencion.get('txtEmpresa')?.value;//OK
    this.historiaClinica.DHIS_FEC_ATE = this.convertDate(this.hoyFecha);//OK
    this.historiaClinica.DHIS_HOR_ATE = '';//OK
    this.historiaClinica.SHIS_AMB_COD_DIS_ORIGEN = this.codUbigeoOrigen;//OK
    this.historiaClinica.SHIS_AMB_DES_DIS_ORIGEN = this.frmNuevaAtencion.get('txtUbigeoOrigen')?.value;//OK
    this.historiaClinica.SHIS_AMB_DIR_ORIGEN = this.frmNuevaAtencion.get('txtDireccionOrigen')?.value;//OK
    this.historiaClinica.SHIS_AMB_REF_DIR_ORIGEN = this.frmNuevaAtencion.get('txtReferenciaOrigen')?.value;//OK
    this.historiaClinica.DHIS_AMB_FECHA_INI = this.convertDate(this.hoyFecha);//OK
    this.historiaClinica.DHIS_AMB_FECHA_FIN = this.convertDate(this.hoyFecha);//OK
    let now = this.hoyFecha;
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    this.historiaClinica.DHIS_AMB_HORA_INI = hours + ':' + minutes;//OK
    this.historiaClinica.DHIS_AMB_HORA_FIN = hours + ':' + minutes;//OK
    this.historiaClinica.SHIS_AMB_COD_DIS_DESTINO = '';//OK
    this.historiaClinica.SHIS_AMB_DES_DIS_DESTINO = '';//OK
    this.historiaClinica.SHIS_AMB_DIR_DESTINO = '';//OK
    this.historiaClinica.SHIS_AMB_REF_DIR_DESTINO = '';//OK
    this.historiaClinica.SHIS_TIPO_SERVICIO = 'XXXX';//OK
    this.historiaClinica.NHIS_COD_PRIORIDAD_CALLMED = 0;//OK
    this.historiaClinica.NHIS_COD_MOTIVO_ATE_CALLMED = 0;//OK
    this.historiaClinica.NHIS_TAR_ATE = this.frmNuevaAtencion.get('txtDeducible')?.value || 0;//OK
    this.historiaClinica.NHIS_COASEGURO = this.frmNuevaAtencion.get('txtCoaseguro')?.value;//OK
    this.historiaClinica.SHIS_TIPO_DOC_PAGO = this.valTipoComprobante.toString();//OK
    this.historiaClinica.observacion = '';//OK
    this.historiaClinica.SHIS_CM_DENOMINACION = this.frmNuevaAtencion.get('txtMontoEfectivo')?.value;//OK
    this.historiaClinica.SHIS_FOR_ATE = this.formaPago;//OK
    this.historiaClinica.NHIS_ID_TIPO_TRASLADO_CALLMED = 0;//OK
    this.historiaClinica.SHIS_COD_AUT_PRESTACION = '';//OK
    this.historiaClinica.SHIS_CONTRATANTE_CITRIX = '';//OK
    this.historiaClinica.SHIS_COD_ASEGURADO = '';//OK
    this.historiaClinica.SHIS_CM_ASEG_PRODUCTO = '';//OK
    this.historiaClinica.SHIS_POLIZA_ASEGURADO = '';//OK
    this.historiaClinica.SHIS_POLIZA_CERTIFICADO = '';//OK
    this.historiaClinica.FPAC_FLG_CONFLICTIVO_CALLMED = this.valPacienteConflictivo;//OK
    this.historiaClinica.FHIS_AMB_SERVICIO_PLAYA = this.valAmbulanciaPlaya;//OK
    this.historiaClinica.FHIS_FUERA_COBERTURA = this.valFueraCobertura;//OK
    this.historiaClinica.SHIS_DIRECCION_ORIGEN = '';//OK
    this.historiaClinica.SHIS_DIRECCION_DESTINO = '';//OK
    this.historiaClinica.CCLI_ID_ORIGEN = 0;//OK
    this.historiaClinica.CCLI_ID_DESTINO = 0;//OK
    this.historiaClinica.SHIS_ALERGIA_MEDICA = '';//OK
    this.historiaClinica.SHIS_ATENCEDENTE = '';//OK
    this.historiaClinica.CTAM_ID = this.valTipoAmbulancia;//OK
    this.historiaClinica.SHIS_RUC_EVENTO = this.frmNuevaAtencion.get('txtRuc')?.value;//OK
    this.historiaClinica.SHIS_RAZON_SOCIAL_EVENTO = this.frmNuevaAtencion.get('txtRazonsocial')?.value;//OK
    this.historiaClinica.SHIS_DIRECCION_FISCAL_EVENTO = this.frmNuevaAtencion.get('txtDireccionFiscal')?.value;//OK
    this.historiaClinica.CPOL_ID = 0;//POR CONSULTAR
    this.historiaClinica.SHIS_NRO_PLACA = '';//OK
    this.historiaClinica.SHIS_NRO_POLIZA = '';//OK
    this.historiaClinica.SHIS_SINIESTRO = '';//OK
    this.historiaClinica.SHIS_AHUTORIZA_CORTESIA = '';//OK
    this.historiaClinica.SHIS_REGLA_ORO = '';//POR CONSULTAR
    this.historiaClinica.FHIS_AMB_RESPIRATORIA = false;//OK
    this.historiaClinica.CPAR_ID_SOLICITANTE = this.frmNuevaAtencion.get('cboSolicitado')?.value;//OK
    this.historiaClinica.SHIS_UBIC_DENTRO_CLINICA_ORIGEN = '';//OK
    this.historiaClinica.SHIS_UBIC_DENTRO_CLINICA_DESTINO = '';//OK
    this.historiaClinica.NPRV_ID = 0;//OK
    this.historiaClinica.DHIS_FECHA_EVENTO_ADVERSO = '';//OK
    this.historiaClinica.CPAR_ID_SOLICITUD = this.valSolicitud;//OK
    this.historiaClinica.FHIS_CITRIX = false;//OK
    this.historiaClinica.estado = 1;//OK
    this.historiaClinica.NHIS_EDAD_ATE = 0;//OK
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
      this._historiaClinicaServices.addHistoriaClinicaAmbulanciaEvento(this.historiaClinica).subscribe({
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

  openDireccionDialog() {
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