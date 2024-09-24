import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SctrMantenimientoclinicaComponent } from '../sctr-mantenimiento-clinica/sctr-mantenimiento-clinica.component';
import { SctrNuevatencionComponent } from '../sctr-nueva-atencion/sctr-nueva-atencion.component';
import { ConfirmaranularatencionComponent } from '../sctr-confirmar-anular-atencion/confirmar-anular-atencion.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sctr-soporte',
  templateUrl: './sctr-soporte.component.html',
  styleUrl: './sctr-soporte.component.scss'
})
export class SctrSoporteComponent {
  dataAtencion: any;
  estadoAtencion: string;
  reporte: number;

  constructor(private _dialog: MatDialog, public _dialogRef: MatDialogRef<SctrSoporteComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private toastrService: ToastrService) {
    this.dataAtencion = data.datos_atencion;
    this.estadoAtencion = this.dataAtencion.estado;
    this.reporte = data.reporte;
  }

  opcionSeleccionada = "";

  getOpcionSoporte(target: any) {
    this.opcionSeleccionada = target.value;
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  darSoporte() {
    if (this.opcionSeleccionada == "ModificarDatos") {

      const dialogRef = this._dialog.open(SctrNuevatencionComponent, {
        panelClass: 'sanna_theme',
        disableClose: true,
        data: { 'codAtencionEditar': this.dataAtencion.cod_historia_clinica },
        width: '1100px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this._dialogRef.close(true);
      });

    } else if (this.opcionSeleccionada == "AnularAtencion") {

      const dialogRef = this._dialog.open(ConfirmaranularatencionComponent, {
        data: { 'cod_historia_clinica': this.dataAtencion.cod_historia_clinica },
        panelClass: 'sanna_theme',
        disableClose: true,
        width: '430px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this._dialogRef.close(true);
      });

    } else if (this.opcionSeleccionada == "MantenimientoClinica") {

      this._dialog.open(SctrMantenimientoclinicaComponent, {
        panelClass: 'sanna_theme',
        width: '620px'
      });

    } else {
      this.toastrService.warning('¡Por favor seleecione una opción!');
    }
  }
}