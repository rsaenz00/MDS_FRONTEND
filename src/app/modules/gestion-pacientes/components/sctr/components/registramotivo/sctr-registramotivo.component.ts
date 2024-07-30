import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Cliente } from 'src/app/models/cliente.model';
import { MatOption } from '@angular/material/core';
import { ListadoclinicasComponent } from '../listadoclinicas/listadoclinicas.component';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { limpiarLetras, limpiarNumero, soloLetras, soloNumeros } from 'src/app/util/forms.validate';
import { RegistraclienteComponent } from '../registracliente/registracliente.component';

@Component({
  selector: 'app-sctr-registramotivo',
  templateUrl: './sctr-registramotivo.component.html',
  styleUrl: './sctr-registramotivo.component.scss'
})

export class SctrRegistramotivoComponent {
  cboMotivo: any;
  rdSkill: any;
  pacienteReporta: string;
  valRuc: string;
  reporta: string;
  codClinica: number;
  usuarioEnlinea: UsuarioAuth;

  constructor(private _dialog: MatDialog, private frm: FormBuilder, private toastrService: ToastrService, private _historiaClinicaServices: HistoriaClinicaService, private _clienteService: ClienteService, public _dialogRef: MatDialogRef<SctrRegistramotivoComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
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
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  valIdCliente = 0;

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

  openAddClienteDialog() {
    const dialogRef = this._dialog.open(RegistraclienteComponent, {
      panelClass: 'sanna_theme',
      width: '430px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this._clienteService.getClienteListByRuc(result.data.ruc).subscribe({
        next: (res) => {
          this.filtradoClientes = res.resultData;
          this.verRuc(res.resultData);
          for (let option_ of this.filtradoClientes) {
            this.valIdCliente = parseInt(option_.id_cliente);
          }
          this.formularioRegitraMotivoSctr.get("txtEmpresa")?.setValue(result.data.nombre);
          this.formularioRegitraMotivoSctr.get("txtRucEmpresa")?.setValue(result.data.nombre);
          this.valRuc = result.data.ruc;
        },
        error: console.log,
      });
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
    this.valIdCliente = option.value.id_cliente;
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
    this.valIdCliente = 0;
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
      this.historiaClinica.skill = this.rdSkill;
      this.historiaClinica.motivo_skill = this.cboMotivo;
      this.historiaClinica.observacion = this.formularioRegitraMotivoSctr.value['txtMotivo'] || '';
      this.historiaClinica.estado = 1;
      this.historiaClinica.usuario_creacion = this.usuarioEnlinea.id || '';

      if (this.reporta == "clinica") {
        this.historiaClinica.centro_clinico = 1;
        this.historiaClinica.empresa = 0;
        this.historiaClinica.corredor_seguro = 0;
        this.historiaClinica.paciente_asegurado = 0;
        this.historiaClinica.persona_reporta_clinica = this.formularioRegitraMotivoSctr.value['txtPacienteReportaClinica'] || '';
        this.historiaClinica.id_clinica = this.codClinica;
      } else if (this.reporta == "empresa") {
        this.historiaClinica.empresa = 1;
        this.historiaClinica.centro_clinico = 0;
        this.historiaClinica.corredor_seguro = 0;
        this.historiaClinica.paciente_asegurado = 0;
        this.historiaClinica.persona_reporta_empresa = this.formularioRegitraMotivoSctr.value['txtPacienteReportaempresa'] || '';
        this.historiaClinica.id_empresa = this.valIdCliente;
      } else if (this.reporta == "seguro") {
        this.historiaClinica.corredor_seguro = 1;
        this.historiaClinica.centro_clinico = 0;
        this.historiaClinica.empresa = 0;
        this.historiaClinica.paciente_asegurado = 0;
        this.historiaClinica.persona_reporta_seguro = this.formularioRegitraMotivoSctr.value['txtPacienteReportaSeguro'] || '';
      } else if (this.reporta == "paciente") {
        this.historiaClinica.paciente_asegurado = 1;
        this.historiaClinica.corredor_seguro = 0;
        this.historiaClinica.centro_clinico = 0;
        this.historiaClinica.empresa = 0;
        this.historiaClinica.persona_reporta_asegurado = this.formularioRegitraMotivoSctr.value['txtPacienteReportaAsegurado'] || '';
      }

      //console.log(this.historiaClinica)

      this._historiaClinicaServices.addHistoriaClinicaSctr(this.historiaClinica).subscribe({
        next: (res: any) => {
          if (res.resultData.cod_historia_clinica == 0) {
            this.toastrService.error('¡No se pudo registrar la atención!', 'Atención', { timeOut: 3000 });
          } else {
            this.toastrService.success('¡Se ha creado la atención N° ' + res.resultData.cod_historia_clinica + ' de forma satisfactoria.', undefined, { timeOut: 5000 });
            this._dialogRef.close(true);
          }
        },
        error: (err: any) => {
          console.error(err);
        },
      });

    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
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
}