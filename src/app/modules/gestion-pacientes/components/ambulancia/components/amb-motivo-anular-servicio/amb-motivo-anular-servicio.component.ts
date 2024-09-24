import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { Parametro } from 'src/app/models/parametro.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { ParametroService } from 'src/app/services/parametro.service';
import { AmbConfirmaranularatencionComponent } from '../amb-confirmar-anular-atencion/amb-confirmar-anular-atencion.component';

@Component({
  selector: 'app-amb-motivo-anular-servicio',
  templateUrl: './amb-motivo-anular-servicio.component.html',
  styleUrl: './amb-motivo-anular-servicio.component.scss'
})
export class AmbMotivoAnularServicioComponent {
  cod_historia_clinica: any;
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  usuarioEnlinea: UsuarioAuth;
  motivos: Parametro[];
  valMotivo = 0;

  constructor(public _dialogRef: MatDialogRef<AmbMotivoAnularServicioComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _historiaClinicaServices: HistoriaClinicaService, private _parametroService: ParametroService, private toastrService: ToastrService, private frm: FormBuilder, private _dialog: MatDialog) {
    //this.cod_historia_clinica = data.cod_historia_clinica
    this.cod_historia_clinica = data.codAtencionEditar;
  }

  formAnularServicio = this.frm.group({
    cboMotivo: [Validators.required]
  })

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.getMotivosList();
  }

  getMotivosList() {
    this._parametroService.GetParametro('10').subscribe({
      next: (res) => {
        this.motivos = res.resultData;
      },
      error: console.log,
    });
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  getMotivoCbo(target: any) {
    this.valMotivo = target.value;
  }

  continuar() {
    if (this.formAnularServicio.valid) {
      const dialog = this._dialog.open(AmbConfirmaranularatencionComponent, {
        panelClass: 'sanna_theme',
        data: { 'dataFormAnularServicio': this.formAnularServicio, 'codAtencionEditar': this.cod_historia_clinica },
        disableClose: true,
        width: '430px'
      });

      dialog.afterClosed().subscribe(result => {
        this._dialogRef.close(true);
      });
    } else {
      this.toastrService.warning('¡Seleccione un motivo para continuar la anulación de la atención!')
    }
  }
}
