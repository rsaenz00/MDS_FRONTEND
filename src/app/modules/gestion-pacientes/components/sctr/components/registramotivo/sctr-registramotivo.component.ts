import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Atencion } from 'src/app/models/atencion.model';
import { AtencionService } from 'src/app/services/atencion.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { MatOption } from '@angular/material/core';
import { ListadoclinicasComponent } from '../listadoclinicas/listadoclinicas.component';
import { UsuarioAuth } from 'src/app/models/usuario-auth';

var valIdCliente = 0;

@Component({
  selector: 'app-sctr-registramotivo',
  templateUrl: './sctr-registramotivo.component.html',
  styleUrl: './sctr-registramotivo.component.scss'
})

export class SctrRegistramotivoComponent {
  cboMotivo: any;
  rdSkill: any;
  pacienteReporta: string;
  codClinica: number;
  reporta: string;
  usuarioEnlinea: UsuarioAuth;

  constructor(private _dialog: MatDialog, private frm: FormBuilder, private toastrService: ToastrService, private _atencionServices: AtencionService, private _clienteService: ClienteService, public _dialogRef: MatDialogRef<SctrRegistramotivoComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.cboMotivo = data.cboMotivo;
    this.rdSkill = data.rdSkill;
  }

  formularioRegitraMotivoSctr = this.frm.group({
    txtNombreClinica: [{ value: '', disabled: true }],
    txtDireccionClinica: [{ value: '', disabled: true }],
    txtPacienteReportaClinica: [{ value: '', disabled: true }],
    txtRucEmpresa: [{ value: '', disabled: true }],
    txtEmpresa: [{ value: '', disabled: true }],
    txtPacienteReportaempresa: [{ value: '', disabled: true }],
    txtPacienteReportaSeguro: [{ value: '', disabled: true }],
    txtPacienteReportaAsegurado: [{ value: '', disabled: true }],
    txtMotivo: ['', Validators.required]
  })

  statusBtnBuscarClinica = true;
  statusBtnRegistrarEmpresa = true;
  filtradoClientes: Cliente[];
  atencion: Atencion = {} as Atencion;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    //console.log(this.cboMotivo + " - " + this.rdSkill);
  }

  openClinicaDialog() {
    const dialogRef = this._dialog.open(ListadoclinicasComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codClinica = result.data.id_clinica;
      this.formularioRegitraMotivoSctr.controls['txtNombreClinica'].setValue(result.data.clinica);
      this.formularioRegitraMotivoSctr.controls['txtDireccionClinica'].setValue(result.data.direccion);
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

  selectCliente(option: MatOption) {
    valIdCliente = option.value.id_cliente;
    this.formularioRegitraMotivoSctr.get("txtEmpresa")?.setValue(option.value.nombre);
  }

  verRuc(cliente: Cliente): string {
    return cliente && cliente.ruc ? cliente.ruc.trim() : '';
  }

  exitMotivo() {
    this.formularioRegitraMotivoSctr.reset();
    this._dialogRef.close(true);
  }

  getPersonaReporta(target: any) {
    this.statusBtnBuscarClinica = true;
    this.statusBtnRegistrarEmpresa = true;
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaClinica'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaempresa'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaSeguro'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaAsegurado'].disable();
    this.formularioRegitraMotivoSctr.controls['txtRucEmpresa'].disable();
    this.formularioRegitraMotivoSctr.reset();
    this.pacienteReporta = target.value;
    valIdCliente = 0;
    this.codClinica = 0;

    if (this.pacienteReporta == "clinica") {
      this.reporta = "clinica";
      this.statusBtnBuscarClinica = false;
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaClinica'].enable();
    }
    if (this.pacienteReporta == "empresa") {
      this.reporta = "empresa";
      this.statusBtnRegistrarEmpresa = false;
      this.formularioRegitraMotivoSctr.controls['txtRucEmpresa'].enable();
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaempresa'].enable();
    }
    if (this.pacienteReporta == "seguro") {
      this.reporta = "seguro";
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaSeguro'].enable();
    }
    if (this.pacienteReporta == "paciente") {
      this.reporta = "paciente";
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaAsegurado'].enable();
    }
  }

  saveMotivoSctr() {
    if (this.formularioRegitraMotivoSctr.valid) {
      this.atencion.skill = this.rdSkill;
      this.atencion.motivo_skill = this.cboMotivo;
      this.atencion.observacion = this.formularioRegitraMotivoSctr.value['txtMotivo'] || '';
      this.atencion.estado = 0;
      this.atencion.usuario_creacion = this.usuarioEnlinea.id || '';

      if (this.reporta == "clinica") {
        this.atencion.centro_clinico = 1;
        this.atencion.empresa = 0;
        this.atencion.corredor_seguro = 0;
        this.atencion.paciente_asegurado = 0;
        this.atencion.persona_reporta_clinica = this.formularioRegitraMotivoSctr.value['txtPacienteReportaClinica'] || '';
        this.atencion.id_clinica = this.codClinica;
      } else if (this.reporta == "empresa") {
        this.atencion.empresa = 1;
        this.atencion.centro_clinico = 0;
        this.atencion.corredor_seguro = 0;
        this.atencion.paciente_asegurado = 0;
        this.atencion.persona_reporta_empresa = this.formularioRegitraMotivoSctr.value['txtPacienteReportaempresa'] || '';
        this.atencion.id_empresa = valIdCliente;
      } else if (this.reporta == "seguro") {
        this.atencion.corredor_seguro = 1;
        this.atencion.centro_clinico = 0;
        this.atencion.empresa = 0;
        this.atencion.paciente_asegurado = 0;
        this.atencion.persona_reporta_seguro = this.formularioRegitraMotivoSctr.value['txtPacienteReportaSeguro'] || '';
      } else if (this.reporta == "paciente") {
        this.atencion.paciente_asegurado = 1;
        this.atencion.corredor_seguro = 0;
        this.atencion.centro_clinico = 0;
        this.atencion.empresa = 0;
        this.atencion.persona_reporta_asegurado = this.formularioRegitraMotivoSctr.value['txtPacienteReportaAsegurado'] || '';
      }

      //console.log(this.atencion)

      this._atencionServices.addAtencion(this.atencion).subscribe({
        next: (val: any) => {
          this.toastrService.success('¡Motivo creado satisfactoriamene!');
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
