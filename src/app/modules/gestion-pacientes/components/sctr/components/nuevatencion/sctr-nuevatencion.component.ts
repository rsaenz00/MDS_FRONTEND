import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { ParametroService } from 'src/app/services/parametro.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan.model';
import { Parametro } from 'src/app/models/parametro.model';
import { SctrMantenimientoclinicaComponent } from '../mantenimientoclinica/sctr-mantenimientoclinica.component';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { ListadoclinicasComponent } from '../listadoclinicas/listadoclinicas.component';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { AtencionService } from 'src/app/services/atencion.service';
import { ToastrService } from 'ngx-toastr';
import { Atencion } from 'src/app/models/atencion.model';
import { MatOption } from '@angular/material/core';
import { ListadopacientesComponent } from '../listadopacientes/listadopacientes.component';
import { UsuarioAuth } from 'src/app/models/usuario-auth';

var cboMotivoValidacion = 0, paseAtencion = 0, valIdCliente = 0;

@Component({
  selector: 'app-sctr-nuevatencion',
  templateUrl: './sctr-nuevatencion.component.html',
  styleUrl: './sctr-nuevatencion.component.scss'
})

export class SctrNuevatencionComponent {
  tipoAtencion: number;
  cboMotivo: any;
  rdSkill: any;
  codClinica: number;
  codPaciente: number;
  usuarioEnlinea: UsuarioAuth;

  constructor(private _dialog: MatDialog, private _motivoService: MotivoService, private _parametroService: ParametroService, private _planServices: PlanService, private _atencionServices: AtencionService, private _clienteService: ClienteService, private frm: FormBuilder, private toastrService: ToastrService, private _tipoDocumentoService: TipoDocumentoService, public _dialogRef: MatDialogRef<SctrNuevatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.cboMotivo = data.cboMotivo;
    this.rdSkill = data.rdSkill;
  }

  formularioNuevaAtencionSctr = this.frm.group({
    txtNroAtencion: [{ value: '', disabled: true }],
    txtClinica: [{ value: '', disabled: true }, Validators.required],
    txtDireccion: [{ value: '', disabled: true }, Validators.required],
    txtTelefono: ['', Validators.required],
    txtAnexo: [''],
    txtPersonaReporta: ['', Validators.required],
    txtApePaterno: [{ value: '', disabled: true }],
    txtApeMaterno: [{ value: '', disabled: true }],
    txtNombres: [{ value: '', disabled: true }],
    txtNroDocumento: [{ value: '', disabled: true }],
    txtFechaNacimiento: [{ value: '', disabled: true }],
    cboSexo: [{ value: '', disabled: true }],
    cboTipoDocumento: [{ value: '', disabled: true }],
    txtCelular: [{ value: '', disabled: true }],
    txtRuc: ['', Validators.required],
    txtEmpresa: ['', Validators.required],
    txtAseguradora: [{ value: '', disabled: true }],
    /*txtLugarAccidente: [{ value: '', disabled: true }],
    txtPuestoCargo: [{ value: '', disabled: true }],
    txtInicioLabores: [{ value: '', disabled: true }],
    txtTerminoLabores: [{ value: '', disabled: true }],
    txtFechaAccidente: [{ value: '', disabled: true }],
    txtHoraAccidente: [{ value: '', disabled: true }],
    txtRelatoAccidente: [{ value: '', disabled: true }],*/
    rbHojaAtencion: ['', Validators.required],
    cboMetodoValidacion: ['', Validators.required],
    cboPlan: [{ value: '', disabled: true }, Validators.required],
    rbPaseAtencion: ['', Validators.required],
    cboMotivo: [{ value: '', disabled: true }],
    txtObservacion: [''],
    txtClinicaPrimeraAtencion: [{ value: '', disabled: true }]
  });

  motivos: Motivo[];
  planes: Plan[];
  validaciones: Parametro[];
  sexos: Parametro[];
  tipoDocumentos: TipoDocumento[];
  statusBtnClinicaPrimAtencion = false;
  statusBtnLugarAccidente = true;
  startDate = new Date(1990, 0, 1);
  filtradoClientes: Cliente[];
  atencion: Atencion = {} as Atencion;
  statusBtnFiltrarPaciente = false;
  statusBtnNuevoPaciente = false;
  statusBtnGuardarPaciente = true;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    //console.log(this.cboMotivo + " - " + this.rdSkill);
    this.getMetodosValidacionList();
    this.getPlanesList();
    this.getSexosList();
    this.getTipoDocumentosList();
  }

  newPaciente() {
    this.codPaciente = 0;
    this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].enable();
    this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].enable();
    this.formularioNuevaAtencionSctr.controls['txtApePaterno'].enable();
    this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].enable();
    this.formularioNuevaAtencionSctr.controls['txtNombres'].enable();
    this.formularioNuevaAtencionSctr.controls['txtCelular'].enable();
    this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].enable();
    this.formularioNuevaAtencionSctr.controls['cboSexo'].enable();

    this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].reset();
    this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].reset();
    this.formularioNuevaAtencionSctr.controls['txtApePaterno'].reset();
    this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].reset();
    this.formularioNuevaAtencionSctr.controls['txtNombres'].reset();
    this.formularioNuevaAtencionSctr.controls['txtCelular'].reset();
    this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].reset();
    this.formularioNuevaAtencionSctr.controls['cboSexo'].reset();

    this.statusBtnGuardarPaciente = false;
    this.statusBtnNuevoPaciente = true;
  }

  filtrarPaciente() {
    this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].disable();
    this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].disable();
    this.formularioNuevaAtencionSctr.controls['txtApePaterno'].disable();
    this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].disable();
    this.formularioNuevaAtencionSctr.controls['txtNombres'].disable();
    this.formularioNuevaAtencionSctr.controls['txtCelular'].disable();
    this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].disable();
    this.formularioNuevaAtencionSctr.controls['cboSexo'].disable();

    this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].reset();
    this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].reset();
    this.formularioNuevaAtencionSctr.controls['txtApePaterno'].reset();
    this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].reset();
    this.formularioNuevaAtencionSctr.controls['txtNombres'].reset();
    this.formularioNuevaAtencionSctr.controls['txtCelular'].reset();
    this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].reset();
    this.formularioNuevaAtencionSctr.controls['cboSexo'].reset();

    this.statusBtnGuardarPaciente = true;
    this.statusBtnNuevoPaciente = false;

    const dialogRef = this._dialog.open(ListadopacientesComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codPaciente = result.data.id_clinica;
      this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].setValue(result.data.clinica);
      this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].setValue(result.data.clinica);
      this.formularioNuevaAtencionSctr.controls['txtApePaterno'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['txtNombres'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['txtCelular'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['cboSexo'].setValue(result.data.direccion);
    });
  }

  filterClientes(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    if (ds.length >= 3) {
      this._clienteService.getClienteListByRuc(ds).subscribe({
        next: (res) => {
          //console.log(res.resultData)
          this.filtradoClientes = res.resultData;
        },
        error: console.log,
      });
    }
  }

  getSexosList() {
    this._parametroService.GetParametro('1').subscribe({
      next: (res) => {
        this.sexos = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDocumentosList() {
    this._tipoDocumentoService.GetTipoDocumentos().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
  }

  getMetodosValidacionList() {
    this._parametroService.GetParametro('5').subscribe({
      next: (res) => {
        this.validaciones = res.resultData;
      },
      error: console.log,
    });
  }

  getPlanesList() {
    this._planServices.GetPlanesList().subscribe({
      next: (res) => {
        this.planes = res.resultData;
      },
      error: console.log,
    });
  }

  getPaseAtencion(target: any) {
    paseAtencion = target.value;
    this.getMotivo();
  }

  getTipoAtencion(target: any) {
    this.tipoAtencion = target.value;
    this.getMotivo();
    if (this.tipoAtencion == 2) {
      this.statusBtnClinicaPrimAtencion = true;
    } else {
      this.statusBtnClinicaPrimAtencion = false;
    }
  }

  getMotivo() {
    this.motivos = [];

    this.formularioNuevaAtencionSctr.controls['cboMotivo'].reset();
    if ((this.tipoAtencion == 1 && paseAtencion == 0) || (this.tipoAtencion == 2 && paseAtencion == 0) || (this.tipoAtencion == 1 && paseAtencion == 1)) {
      this.formularioNuevaAtencionSctr.controls['cboMotivo'].disable();
    } else {
      this._motivoService.GetMotivosListByTipoAndPase(this.tipoAtencion, paseAtencion).subscribe({
        next: (res) => {
          this.formularioNuevaAtencionSctr.controls['cboMotivo'].enable();
          this.motivos = res.resultData;
        },
        error: console.log,
      });
    }
  }

  getMotivoValidacionCbo(target: any) {
    cboMotivoValidacion = target.value;
    if (cboMotivoValidacion == 3 || cboMotivoValidacion == 4) {
      this.formularioNuevaAtencionSctr.controls['cboPlan'].disable();
      this.formularioNuevaAtencionSctr.controls['cboPlan'].reset();
    } else {
      this.formularioNuevaAtencionSctr.controls['cboPlan'].enable();
    }
  }

  openMantClinicaDialog() {
    this._dialog.open(SctrMantenimientoclinicaComponent, {
      panelClass: 'sanna_theme',
      width: '620px'
    });
  }

  openClinicaDialog() {
    const dialogRef = this._dialog.open(ListadoclinicasComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codClinica = result.data.id_clinica;
      this.formularioNuevaAtencionSctr.controls['txtClinica'].setValue(result.data.clinica);
      this.formularioNuevaAtencionSctr.controls['txtDireccion'].setValue(result.data.direccion);
    });
  }

  selectCliente(option: MatOption) {
    valIdCliente = option.value.id_cliente;
    this.formularioNuevaAtencionSctr.get("txtEmpresa")?.setValue(option.value.nombre);
  }

  verRuc(cliente: Cliente): string {
    return cliente && cliente.ruc ? cliente.ruc.trim() : '';
  }

  exitAtencion() {
    this.formularioNuevaAtencionSctr.reset();
    this._dialogRef.close(true);
  }

  savePaciente() {
    this.formularioNuevaAtencionSctr.controls['cboTipoDocumento'].disable();
    this.formularioNuevaAtencionSctr.controls['txtNroDocumento'].disable();
    this.formularioNuevaAtencionSctr.controls['txtApePaterno'].disable();
    this.formularioNuevaAtencionSctr.controls['txtApeMaterno'].disable();
    this.formularioNuevaAtencionSctr.controls['txtNombres'].disable();
    this.formularioNuevaAtencionSctr.controls['txtCelular'].disable();
    this.formularioNuevaAtencionSctr.controls['txtFechaNacimiento'].disable();
    this.formularioNuevaAtencionSctr.controls['cboSexo'].disable();
    this.statusBtnGuardarPaciente = true;
    this.statusBtnNuevoPaciente = false;
  }

  saveAtencionSctr() {
    if (this.formularioNuevaAtencionSctr.valid) {
      this.atencion.id_persona = this.codPaciente;
      this.atencion.id_empresa = valIdCliente;
      this.atencion.id_clinica = this.codClinica;
      this.atencion.id_motivo = this.formularioNuevaAtencionSctr.value["cboMotivo"] || '0';
      this.atencion.id_plan = this.formularioNuevaAtencionSctr.value["cboPlan"] || '0';
      this.atencion.telefono = this.formularioNuevaAtencionSctr.value["txtTelefono"] || '';
      this.atencion.anexo = this.formularioNuevaAtencionSctr.value["txtAnexo"] || '';
      //this.atencion.horario_trabajo = this.formularioNuevaAtencionSctr.value["txtInicioLabores"] + " " + this.formularioNuevaAtencionSctr.value["txtTerminoLabores"];
      //this.atencion.cargo = this.formularioNuevaAtencionSctr.value["txtPuestoCargo"] || '';
      //this.atencion.relato = this.formularioNuevaAtencionSctr.value["txtRelatoAccidente"] || '';
      //this.atencion.fecha_accidente = this.formularioNuevaAtencionSctr.value["txtFechaAccidente"] || '';
      //this.atencion.hora_accidente = this.formularioNuevaAtencionSctr.value["txtHoraAccidente"] || '';
      this.atencion.observacion = this.formularioNuevaAtencionSctr.value["txtObservacion"] || '';
      this.atencion.hoja_atencion = this.formularioNuevaAtencionSctr.value["rbHojaAtencion"] || '';
      this.atencion.skill = this.rdSkill;
      this.atencion.motivo_skill = this.cboMotivo;
      this.atencion.metodo_validacion = cboMotivoValidacion.toString();
      this.atencion.primera_atencion = this.tipoAtencion.toString();
      this.atencion.persona_reporta_clinica = this.formularioNuevaAtencionSctr.value["txtPersonaReporta"] || '';
      this.atencion.estado = 1;
      this.atencion.usuario_creacion = this.usuarioEnlinea.id || '';

      //console.log(this.atencion)

      this._atencionServices.addAtencion(this.atencion).subscribe({
        next: (val: any) => {
          this.toastrService.success('¡Atención creada satisfactoriamene!');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });

    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }
}
