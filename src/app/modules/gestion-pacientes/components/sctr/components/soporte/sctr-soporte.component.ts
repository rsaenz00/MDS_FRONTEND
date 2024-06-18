import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SctrMantenimientoclinicaComponent } from '../mantenimientoclinica/sctr-mantenimientoclinica.component';
import { SctrNuevatencionComponent } from '../nuevatencion/sctr-nuevatencion.component';
import { ConfirmaranularatencionComponent } from '../confirmaranularatencion/confirmaranularatencion.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sctr-soporte',
  templateUrl: './sctr-soporte.component.html',
  styleUrl: './sctr-soporte.component.scss'
})
export class SctrSoporteComponent {
  dataAtencion: any;

  constructor(private _dialog: MatDialog, public _dialogRef: MatDialogRef<SctrSoporteComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private toastrService: ToastrService) {
    this.dataAtencion = data.datos_atencion
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
        data: { 'codAtencionEditar': this.dataAtencion.cod_atencion },
        width: '1100px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this._dialogRef.close(true);
      });

    } else if (this.opcionSeleccionada == "AnularAtencion") {

      const dialogRef = this._dialog.open(ConfirmaranularatencionComponent, {
        data: { 'id_atencion': this.dataAtencion.cod_atencion },
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
