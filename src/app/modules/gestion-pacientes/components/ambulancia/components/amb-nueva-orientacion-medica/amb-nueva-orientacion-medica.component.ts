import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CentroMedicoDerivado } from 'src/app/models/centromedicoderivado.model';
import { Cliente } from 'src/app/models/cliente.model';
import { EspecialidadCallMedico } from 'src/app/models/especialidadcallmedico.model';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { Paciente } from 'src/app/models/paciente.model';
import { Parametro } from 'src/app/models/parametro.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { CentroMedicoDerivadoService } from 'src/app/services/centromedicoderivado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CoreService } from 'src/app/services/core.service';
import { EspecialidadCallMedicoService } from 'src/app/services/especialidadcallmedico.service';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { ParametroService } from 'src/app/services/parametro.service';
import { limpiarLetras, limpiarNumero, primer9, rellenaCaracteres, soloLetras, soloNumeros, validarEmail } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-nueva-orientacion-medica',
  templateUrl: './amb-nueva-orientacion-medica.component.html',
  styleUrl: './amb-nueva-orientacion-medica.component.scss'
})

export class AmbNuevaOrientacionMedicaComponent implements OnInit {
  options = this.settings.getOptions();
  frmOrientacionMedica: FormGroup;
  usuarioEnlinea: UsuarioAuth;
  datosPacienteSiteds: Paciente;
  solicitudes: Parametro[];
  motivosAtencion: Parametro[];
  tiposReferencia: Parametro[];
  filtradoClientes: Cliente[];
  filteredOptions: Cliente[];
  centrosMedicosDervidados: CentroMedicoDerivado[];
  especialidadesCallMedico: EspecialidadCallMedico[];
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  tipoServicio: string = '';
  valCliente: string;
  codCliente: number = 0;
  valCodClienteSiteds: number;
  valSolicitud = 0;
  valMotivoAtencion = 0;
  valTipoReferencia = 0;
  codPaciente = 0;
  showSpinner = false;

  constructor(
    private settings: CoreService,
    private dialogRef: MatDialogRef<AmbNuevaOrientacionMedicaComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _parametroService: ParametroService,
    private _centroMedicoDerivadoService: CentroMedicoDerivadoService,
    private _especialidadCallMedico: EspecialidadCallMedicoService,
    private toastrService: ToastrService,
    private _historiaClinicaServices: HistoriaClinicaService,
    private _clienteService: ClienteService) {
    this.datosPacienteSiteds = data;
  }

  ngOnInit() {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.tipoServicio = localStorage.getItem('tipoServicio') as string;
    this.getTipoSolicitudList();
    this.getMotivoAtencionList();
    this.getClientesList();

    this.frmOrientacionMedica = this.fb.group({
      cboCliente: ['', Validators.required],
      cboSolicitud: [{ value: '', disabled: false }, Validators.required],
      txtApellidoPaterno: [{ value: '', disabled: true }, Validators.required],
      txtApellidoMaterno: [{ value: '', disabled: true }, Validators.required],
      txtNombres: [{ value: '', disabled: true }, Validators.required],
      txtSexo: [{ value: '', disabled: true }, Validators.required],
      txtCorreo: [{ value: '', disabled: false }, Validators.required],
      txtTipoDoc: [{ value: '', disabled: true }, Validators.required],
      txtNumDoc: [{ value: '', disabled: true }, Validators.required],
      txtTelefonoMovil: [{ value: '', disabled: false }, Validators.required],
      txtEdad: [{ value: '', disabled: true }, Validators.required],
      txtTelefonoFijo: [{ value: '', disabled: false }, Validators.required],
      cboMotivo: [{ value: '', disabled: false }, Validators.required],
      txtObservacion: [{ value: '', disabled: false }, Validators.required],
      chkReferencia: [{ value: '', disabled: false }],
      cboReferencia: [{ value: '', disabled: true }],
      cboDestino: [{ value: '', disabled: true }],
      cboEspecialidad: [{ value: '', disabled: true }]
    });

    if (this.datosPacienteSiteds) {
      if (this.datosPacienteSiteds["data"]["codAutorizacion"]) {
        this.valCodClienteSiteds = this.datosPacienteSiteds["data"]["codCliente"];
        this.frmOrientacionMedica.controls['cboCliente'].disable();
        this.codPaciente = this.datosPacienteSiteds["data"]["datosSiteds"]["id_paciente"];
        this.frmOrientacionMedica.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoPaternoTitular"]);
        this.frmOrientacionMedica.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["ApellidoMaternoTitular"]);
        this.frmOrientacionMedica.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NombresTitular"]);
        this.frmOrientacionMedica.controls['txtNumDoc'].setValue(this.datosPacienteSiteds["data"]["datosSiteds"]["NumeroDocumentoTitular"]);
        this.frmOrientacionMedica.controls['txtTipoDoc'].setValue(this.datosPacienteSiteds["data"]["datosAsegurado"]["value"]["txtTipoDocPaciente"]);
        this.frmOrientacionMedica.controls['txtEdad'].setValue(this.datosPacienteSiteds["data"]["datosAsegurado"]["value"]["txtEdadPaciente"]);
      } else {
        this.codPaciente = this.datosPacienteSiteds["data"]["id_paciente"];
        this.frmOrientacionMedica.controls['txtApellidoPaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_paterno"]);
        this.frmOrientacionMedica.controls['txtApellidoMaterno'].setValue(this.datosPacienteSiteds["data"]["apellido_materno"]);
        this.frmOrientacionMedica.controls['txtNombres'].setValue(this.datosPacienteSiteds["data"]["nombres"]);
        this.frmOrientacionMedica.controls['txtTipoDoc'].setValue(this.datosPacienteSiteds["data"]["tipo_documento"]);
        this.frmOrientacionMedica.controls['txtNumDoc'].setValue(this.datosPacienteSiteds["data"]["numero_documento"]);
        this.frmOrientacionMedica.controls['txtTelefonoMovil'].setValue(this.datosPacienteSiteds["data"]["movil"]);
        this.frmOrientacionMedica.controls['txtEdad'].setValue(this.datosPacienteSiteds["data"]["edad"]);
      }
    }
  }

  save() {
    this.showSpinner = true;
    let valid = 0;
    if (this.codCliente == 0) {
      this.toastrService.warning('¡Por favor seleccione un Cliente!');
    }
    if (this.codPaciente == 0) {
      this.toastrService.warning('¡Por favor seleccione un Paciente!');
    }
    if (this.frmOrientacionMedica.valid) {
      this.historiaClinica.id_motivo = this.frmOrientacionMedica.value["cboMotivo"] || '0';
      this.historiaClinica.id_empresa = this.codCliente;
      this.historiaClinica.id_persona = this.codPaciente;
      this.historiaClinica.usuario_creacion = this.usuarioEnlinea.id || '';
      this.historiaClinica.estado = 5;
      this.historiaClinica.SHIS_CM_ESTADO = 'G';
      this.historiaClinica.NHIS_COD_ESTADO = 0;
      this.historiaClinica.NHIS_CM_ORDEN = 0;
      this.historiaClinica.FHIS_FLG_CM_NUEVA = true;
      this.historiaClinica.SHIS_REF_DIR = '';
      this.historiaClinica.SHIS_CM_REF_DIR = '';
      this.historiaClinica.FHIS_FLAG_PROGRAMADA = false;
      this.historiaClinica.SHIS_F_PROG = this.tipoServicio;
      this.historiaClinica.SHIS_COD_TIPO_PROG = this.tipoServicio;
      this.historiaClinica.SHIS_COD_DR_SOLICITADO = '';
      this.historiaClinica.FHIS_CM_DIRECTA = true;
      this.historiaClinica.SHIS_FLG_DIRECTO = 'S';
      this.historiaClinica.FHIS_CM_DATOS_COMPLETOS = true;
      this.historiaClinica.NHIS_TAR_ATE = 0;
      this.historiaClinica.SHIS_TIPO_SERVAMB_DRMAS = '1042';
      this.historiaClinica.SHIS_COD_AMB_TIPO_SERV = '1042';
      this.historiaClinica.NHIS_COASEGURO = 0;
      this.historiaClinica.SHIS_FLAGMONE = 'S';
      this.historiaClinica.NHIS_CAMBIO = 0;
      this.historiaClinica.SHIS_FOR_ATE = 'E';
      this.historiaClinica.SHIS_CM_MONEDA_DEN = 'S';
      this.historiaClinica.NHIS_CM_DEN_CAMBIO = 0;
      this.historiaClinica.SHIS_CM_DENOMINACION = '';
      this.historiaClinica.SHIS_CONTACTO_PAC = '';
      this.historiaClinica.SHIS_CONTACTO_ASEG = '';
      this.historiaClinica.SHIS_TIPO_SERVICIO = 'XXXX';
      this.historiaClinica.NHIS_CLASIFICACION_PAC = 26;
      this.historiaClinica.SHIS_TIPO_DOC_PAGO = '';
      this.historiaClinica.SHIS_DESCRP_ZONA = '';
      this.historiaClinica.usuario_creacion = this.usuarioEnlinea.id || '';
      this.historiaClinica.observacion = this.frmOrientacionMedica.value["txtObservacion"] || '0';
      this.historiaClinica.NHIS_CLASIFICACION_PAC_CALLMED = 26;
      //SITEDS CONSULTAR
      this.historiaClinica.SHIS_COD_AUT_PRESTACION = '';
      this.historiaClinica.SHIS_COD_ASEGURADO = '';
      this.historiaClinica.SHIS_CM_ASEG_PRODUCTO = '';
      this.historiaClinica.SHIS_POLIZA_ASEGURADO = '';
      this.historiaClinica.SHIS_POLIZA_CERTIFICADO = '';
      //OTRA TABLA
      this.historiaClinica.CPAR_ID_SOLICITUD = this.frmOrientacionMedica.value["cboSolicitud"] || '0';
      this.historiaClinica.CPAR_ID_MOTIVO_CALLMEDICO = this.frmOrientacionMedica.value["cboMotivo"] || '0';
      this.historiaClinica.CPAR_ID_REFERENCIA_AMBULANCIA = this.frmOrientacionMedica.value["cboReferencia"] || '0';
      this.historiaClinica.CCEN_ID = this.frmOrientacionMedica.value["cboDestino"] || '0';
      this.historiaClinica.CECM_ID = this.frmOrientacionMedica.value["cboEspecialidad"] || '0';

      this._historiaClinicaServices.addHistoriaClinicaAmbulanciaOrientacionMedica(this.historiaClinica).subscribe({
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
      this.validateAllFormFields(this.frmOrientacionMedica);
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
      this.showSpinner = false;
      valid++;
    }
  }

  close() {
    this.dialogRef.close(true);
  }

  activarReferencias(event: MatCheckboxChange): void {
    this.frmOrientacionMedica.controls['cboReferencia'].reset();
    this.frmOrientacionMedica.controls['cboDestino'].reset();
    this.frmOrientacionMedica.controls['cboEspecialidad'].reset();
    if (event.checked) {
      this.frmOrientacionMedica.controls['cboReferencia'].enable();
      this.getTipoReferenciaList();
    } else {
      this.frmOrientacionMedica.controls['cboReferencia'].disable();
      this.frmOrientacionMedica.controls['cboDestino'].disable();
      this.frmOrientacionMedica.controls['cboEspecialidad'].disable();
    }
  }

  getTipoSolicitudList() {
    this._parametroService.GetParametro('6').subscribe({
      next: (res) => {
        this.solicitudes = res.resultData;
        this.valSolicitud = 1;
      },
      error: console.log,
    });
  }

  getMotivoAtencionList() {
    this._parametroService.GetParametro('7').subscribe({
      next: (res) => {
        this.motivosAtencion = res.resultData;
        this.valMotivoAtencion = 1;
      },
      error: console.log,
    });
  }

  getTipoReferenciaList() {
    this._parametroService.GetParametro('8').subscribe({
      next: (res) => {
        this.tiposReferencia = res.resultData;
        this.valTipoReferencia = 1;
        this.getDetinosList(this.valTipoReferencia);
      },
      error: console.log,
    });
  }

  getDetinosList(tipo_referencia: number) {
    this._centroMedicoDerivadoService.GetCentroMedicoDerivadoByTipoReferencia(tipo_referencia).subscribe({
      next: (res) => {
        this.frmOrientacionMedica.controls['cboDestino'].reset();
        this.frmOrientacionMedica.controls['cboEspecialidad'].reset();
        this.centrosMedicosDervidados = res.resultData;
        this.frmOrientacionMedica.controls['cboDestino'].enable();
        this.frmOrientacionMedica.controls['cboEspecialidad'].disable();
      },
      error: console.log,
    });
  }

  getEspecialidadesList(id_centro_medico: number) {
    this._especialidadCallMedico.GetEspecialidadCallMedicoByCentroMedico(id_centro_medico).subscribe({
      next: (res) => {
        this.frmOrientacionMedica.controls['cboEspecialidad'].reset();
        this.especialidadesCallMedico = res.resultData;
        this.frmOrientacionMedica.controls['cboEspecialidad'].enable();
      },
      error: console.log,
    });
  }

  getClientesList() {
    this._clienteService.GetClientesAmbulancia().subscribe({
      next: (res) => {
        this.filtradoClientes = res.resultData;
        this.filteredOptions = res.resultData;

        if (this.valCodClienteSiteds) {
          for (let option_ of this.filteredOptions) {
            if (option_.id_cliente.trim() == this.valCodClienteSiteds.toString()) {
              this.valCliente = option_.nombre.trim();
              this.codCliente = parseInt(option_.id_cliente.trim());
              break;
            }
          }
        }
      },
      error: console.log,
    });
  }

  getTipoReferenciaCbo(target: any) {
    this.getDetinosList(target.value);
  }

  getEspecialidadCbo(target: any) {
    this.getEspecialidadesList(target.value);
  }

  displayLabelCliente(cliente: Cliente): string {
    return cliente && cliente.nombre ? cliente.nombre.trim() : '';
  }

  filterOptionsByLabel(options: Cliente[], label: string): Cliente[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: Cliente) => {
      return option.descripcion.toLowerCase().includes(value);
    });
  }

  filter(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filteredOptions = this.filterOptionsByLabel(this.filtradoClientes, ds);
  }

  selectCliente(option: MatOption) {
    this.codCliente = parseInt(option.value.id_cliente);
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