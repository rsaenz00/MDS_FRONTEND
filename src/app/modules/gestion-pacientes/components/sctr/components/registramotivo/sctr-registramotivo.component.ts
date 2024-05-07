import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sctr-registramotivo',
  templateUrl: './sctr-registramotivo.component.html',
  styleUrl: './sctr-registramotivo.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatDialogModule, MatButtonModule, ReactiveFormsModule]
})

export class SctrRegistramotivoComponent {
  cboMotivo: any;
  rdSkill: any;
  pacienteReporta: string;

  constructor(private frm: FormBuilder, public _dialogRef: MatDialogRef<SctrRegistramotivoComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.cboMotivo = data.cboMotivo;
    this.rdSkill = data.rdSkill;
  }

  formularioRegitraMotivoSctr = this.frm.group({
    txtNombreClinica: [{ value: '', disabled: true }],
    txtDireccionClinica: [{ value: '', disabled: true }],
    txtPacienteReportaClinica: [{ value: '', disabled: true }],
    txtRucEmpresa: [{ value: '', disabled: true }],
    txtNombreEmpresa: [{ value: '', disabled: true }],
    txttxtPacienteReportaempresa: [{ value: '', disabled: true }],
    txtPacienteReportaSeguro: [{ value: '', disabled: true }],
    txtPacienteReportaAsegurado: [{ value: '', disabled: true }],
    txtMotivo: ['', Validators.required]
  })

  statusBtnBuscarClinica = true;
  statusBtnRegistrarEmpresa = true;

  ngOnInit(): void {
    console.log(this.cboMotivo + " - " + this.rdSkill);
  }

  getPersonaReporta(target: any) {
    this.statusBtnBuscarClinica = true;
    this.statusBtnRegistrarEmpresa = true;
    this.formularioRegitraMotivoSctr.controls['txtNombreClinica'].disable();
    this.formularioRegitraMotivoSctr.controls['txtDireccionClinica'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaClinica'].disable();
    this.formularioRegitraMotivoSctr.controls['txtRucEmpresa'].disable();
    this.formularioRegitraMotivoSctr.controls['txtNombreEmpresa'].disable();
    this.formularioRegitraMotivoSctr.controls['txttxtPacienteReportaempresa'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaSeguro'].disable();
    this.formularioRegitraMotivoSctr.controls['txtPacienteReportaAsegurado'].disable();
    this.pacienteReporta = target.value;

    if (this.pacienteReporta == "clinica") {
      this.statusBtnBuscarClinica = false;
      this.formularioRegitraMotivoSctr.controls['txtNombreClinica'].enable();
      this.formularioRegitraMotivoSctr.controls['txtDireccionClinica'].enable();
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaClinica'].enable();
    }
    if (this.pacienteReporta == "empresa") {
      this.statusBtnRegistrarEmpresa = false;
      this.formularioRegitraMotivoSctr.controls['txtRucEmpresa'].enable();
      this.formularioRegitraMotivoSctr.controls['txtNombreEmpresa'].enable();
      this.formularioRegitraMotivoSctr.controls['txttxtPacienteReportaempresa'].enable();
    }
    if (this.pacienteReporta == "seguro") {
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaSeguro'].enable();
    }
    if (this.pacienteReporta == "paciente") {
      this.formularioRegitraMotivoSctr.controls['txtPacienteReportaAsegurado'].enable();
    }
  }
}
