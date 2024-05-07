import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { ParametroService } from 'src/app/services/parametro.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan.model';
import { Parametro } from 'src/app/models/parametro.model';
import { SctrMantenimientoclinicaComponent } from '../mantenimientoclinica/sctr-mantenimientoclinica.component';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ListadoclinicasComponent } from '../listadoclinicas/listadoclinicas.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { AtencionService } from 'src/app/services/atencion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atencion } from 'src/app/models/atencion.model';
import { MatOption } from '@angular/material/core';

var cboMotivoValidacion = 0, paseAtencion = 0, valIdCliente = 0;

@Component({
  selector: 'app-sctr-nuevatencion',
  templateUrl: './sctr-nuevatencion.component.html',
  styleUrl: './sctr-nuevatencion.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatDialogModule, MatButtonModule, CommonModule, ReactiveFormsModule, MatDatepickerModule, MatAutocompleteModule]
})

export class SctrNuevatencionComponent {
  tipoAtencion: number;
  cboMotivo: any;
  rdSkill: any;
  codClinica: number;

  constructor(private _dialog: MatDialog, private _motivoService: MotivoService, private _parametroService: ParametroService, private _planServices: PlanService, private _atencionServices: AtencionService, private _clienteService: ClienteService, private frm: FormBuilder, private _snackBar: MatSnackBar, private _tipoDocumentoService: TipoDocumentoService, public _dialogRef: MatDialogRef<SctrNuevatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
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
    txtLugarAccidente: [{ value: '', disabled: true }],
    txtPuestoCargo: [{ value: '', disabled: true }],
    txtInicioLabores: [{ value: '', disabled: true }],
    txtTerminoLabores: [{ value: '', disabled: true }],
    txtFechaAccidente: [{ value: '', disabled: true }],
    txtHoraAccidente: [{ value: '', disabled: true }],
    txtRelatoAccidente: [{ value: '', disabled: true }],
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

  ngOnInit(): void {
    //console.log(this.cboMotivo + " - " + this.rdSkill);
    this.getMetodosValidacionList();
    this.getPlanesList();
    this.getSexosList();
    this.getTipoDocumentosList();
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
    this._dialog.open(SctrMantenimientoclinicaComponent);
  }

  openClinicaDialog() {
    const dialogRef = this._dialog.open(ListadoclinicasComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codClinica = result.data.id_clinica;
      this.formularioNuevaAtencionSctr.controls['txtClinica'].setValue(result.data.clinica);
      this.formularioNuevaAtencionSctr.controls['txtDireccion'].setValue(result.data.direccion);
    });
  }

  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
      verticalPosition: 'top',
    });
  }

  selectCliente(option: MatOption) {
    valIdCliente = option.value.id_cliente;
    this.formularioNuevaAtencionSctr.get("txtEmpresa")?.setValue(option.value.nombre);
  }

  verRuc(cliente: Cliente): string {
    return cliente && cliente.ruc ? cliente.ruc.trim() : '';
  }

  saveAtencionSctr() {
    if (this.formularioNuevaAtencionSctr.valid) {
      this.atencion.id_persona = 1;
      this.atencion.id_empresa = valIdCliente;
      this.atencion.id_clinica = this.codClinica;
      this.atencion.id_motivo = this.formularioNuevaAtencionSctr.value["cboMotivo"] || '';
      this.atencion.id_plan = this.formularioNuevaAtencionSctr.value["cboPlan"] || '';
      this.atencion.telefono = this.formularioNuevaAtencionSctr.value["txtTelefono"] || '';
      this.atencion.anexo = this.formularioNuevaAtencionSctr.value["txtAnexo"] || '';
      this.atencion.horario_trabajo = this.formularioNuevaAtencionSctr.value["txtInicioLabores"] + " " + this.formularioNuevaAtencionSctr.value["txtTerminoLabores"];
      this.atencion.cargo = this.formularioNuevaAtencionSctr.value["txtPuestoCargo"] || '';
      this.atencion.relato = this.formularioNuevaAtencionSctr.value["txtRelatoAccidente"] || '';
      this.atencion.fecha_accidente = this.formularioNuevaAtencionSctr.value["txtFechaAccidente"] || '';
      this.atencion.hora_accidente = this.formularioNuevaAtencionSctr.value["txtHoraAccidente"] || '';
      this.atencion.observacion = this.formularioNuevaAtencionSctr.value["txtObservacion"] || '';
      this.atencion.hoja_atencion = this.formularioNuevaAtencionSctr.value["rbHojaAtencion"] || '';
      this.atencion.skill = this.rdSkill;
      this.atencion.motivo_skill = this.cboMotivo;
      this.atencion.primera_atencion = this.tipoAtencion.toString();
      this.atencion.persona_reporta_clinica = this.formularioNuevaAtencionSctr.value["txtPersonaReporta"] || '';

      //console.log(this.atencion)

      this._atencionServices.addAtencion(this.atencion).subscribe({
        next: (val: any) => {
          this.openSnackBar('¡Atención creada satisfactoriamene!');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });

    } else {
      this.openSnackBar('¡Por favor complete los campos obligatorios!');
    }
  }
}
