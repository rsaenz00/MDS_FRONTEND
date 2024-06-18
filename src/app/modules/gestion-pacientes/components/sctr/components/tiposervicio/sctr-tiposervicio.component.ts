import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { SctrNuevatencionComponent } from '../nuevatencion/sctr-nuevatencion.component';
import { SctrRegistramotivoComponent } from '../registramotivo/sctr-registramotivo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sctr-tiposervicio',
  templateUrl: './sctr-tiposervicio.component.html',
  styleUrl: './sctr-tiposervicio.component.scss'
})

export class SctrTiposervicioComponent {

  constructor(private _motivoService: MotivoService, private toastrService: ToastrService, private _dialog: MatDialog, public _dialogRef: MatDialogRef<SctrTiposervicioComponent>) { }

  motivos: Motivo[];
  rdSkill = 0;
  cboMotivo = 0;

  ngOnInit(): void {
    this.getMotivosList();
  }

  getMotivosList() {
    this._motivoService.GetMotivosList().subscribe({
      next: (res) => {
        this.motivos = res.resultData;
      },
      error: console.log,
    });
  }

  getSkill(target: any) {
    this.rdSkill = target.value;
  }

  getMotivoCbo(target: any) {
    this.cboMotivo = target.value;
  }

  exitTipoServicio() {
    this._dialogRef.close(true);
  }

  nuevoServicioSctr() {

    if (this.cboMotivo != 0 && this.rdSkill != 0) {
      if (this.cboMotivo == 20) {

        const dialogRef = this._dialog.open(SctrNuevatencionComponent, {
          panelClass: 'sanna_theme',
          disableClose: true,
          data: { 'cboMotivo': this.cboMotivo, 'rdSkill': this.rdSkill },
          width: '1100px'
        });

        dialogRef.afterClosed().subscribe(result => {
          this._dialogRef.close(true);
        });

      } else {

        const dialogRef = this._dialog.open(SctrRegistramotivoComponent, {
          panelClass: 'sanna_theme',
          disableClose: true,
          data: { 'cboMotivo': this.cboMotivo, 'rdSkill': this.rdSkill },
          width: '1100px'
        });

        dialogRef.afterClosed().subscribe(result => {
          this._dialogRef.close(true);
        });

      }
    } else {
      this.toastrService.warning('¡Seleccione los campos para continuar la atención!')
    }

  }

}
