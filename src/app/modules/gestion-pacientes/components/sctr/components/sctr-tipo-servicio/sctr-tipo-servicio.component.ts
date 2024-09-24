import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { SctrNuevatencionComponent } from '../sctr-nueva-atencion/sctr-nueva-atencion.component';
import { SctrRegistramotivoComponent } from '../sctr-registra-motivo/sctr-registra-motivo.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sctr-tipo-servicio',
  templateUrl: './sctr-tipo-servicio.component.html',
  styleUrl: './sctr-tipo-servicio.component.scss'
})

export class SctrTiposervicioComponent {
  constructor(private _motivoService: MotivoService, private toastrService: ToastrService, private _dialog: MatDialog, public _dialogRef: MatDialogRef<SctrTiposervicioComponent>, private frm: FormBuilder) { }

  formTipoServicio = this.frm.group({
    rbSkillAvaya: [{ value: '1' }, Validators.required],
    cboMotivo: ['', Validators.required]
  })

  motivos: Motivo[];
  rdSkill = 1;
  valMotivo = 0;

  ngOnInit(): void {
    this.getMotivosList();
  }

  getMotivosList() {
    this._motivoService.GetMotivosList().subscribe({
      next: (res) => {
        this.motivos = res.resultData;
        this.valMotivo = 20;
      },
      error: console.log,
    });
  }

  getSkill(target: any) {
    this.rdSkill = target.value;
  }

  getMotivoCbo(target: any) {
    this.valMotivo = target.value;
  }

  exitTipoServicio() {
    this._dialogRef.close(true);
  }

  nuevoServicioSctr() {
    if (this.formTipoServicio.valid) {
      if (this.valMotivo != 0 && this.rdSkill != 0) {
        if (this.valMotivo == 20) {

          const dialogRef = this._dialog.open(SctrNuevatencionComponent, {
            panelClass: 'sanna_theme',
            disableClose: true,
            data: { 'cboMotivo': this.valMotivo, 'rdSkill': this.rdSkill },
            width: '1100px'
          });

          dialogRef.afterClosed().subscribe(result => {
            this._dialogRef.close(true);
          });

        } else {

          const dialogRef = this._dialog.open(SctrRegistramotivoComponent, {
            panelClass: 'sanna_theme',
            disableClose: true,
            data: { 'cboMotivo': this.valMotivo, 'rdSkill': this.rdSkill },
            width: '1100px'
          });

          dialogRef.afterClosed().subscribe(result => {
            this._dialogRef.close(true);
          });

        }
      } else {
        this.toastrService.warning('¡Seleccione los campos para continuar la atención!')
      }

    } else {
      this.toastrService.warning('¡Seleccione los campos para continuar la atención!')
    }
  }

}