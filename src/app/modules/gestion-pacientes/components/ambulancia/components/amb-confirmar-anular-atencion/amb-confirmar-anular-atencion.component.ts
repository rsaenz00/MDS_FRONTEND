import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';

@Component({
  selector: 'app-amb-confirmar-anular-atencion',
  templateUrl: './amb-confirmar-anular-atencion.component.html',
  styleUrl: './amb-confirmar-anular-atencion.component.scss'
})
export class AmbConfirmaranularatencionComponent {
  cod_historia_clinica: any;
  frm_anular_servicio: any;
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  usuarioEnlinea: UsuarioAuth;

  constructor(public _dialogRef: MatDialogRef<AmbConfirmaranularatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _historiaClinicaServices: HistoriaClinicaService, private toastrService: ToastrService) {
    this.cod_historia_clinica = data.codAtencionEditar,
    this.frm_anular_servicio = data.dataFormAnularServicio
  }
  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  anularAtencion() {
    this.historiaClinica.cod_historia_clinica = this.cod_historia_clinica;
    this.historiaClinica.id_motivo = this.frm_anular_servicio.get('cboMotivo')?.value;
    this.historiaClinica.usuario_eliminacion = this.usuarioEnlinea.id || '';
    this._historiaClinicaServices.deleteHistoriaClinicaAmbulancia(this.historiaClinica).subscribe({
      next: (val: any) => {
        this.toastrService.success('¡Atención anulada satisfactoriamente!');
        this._dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
}
