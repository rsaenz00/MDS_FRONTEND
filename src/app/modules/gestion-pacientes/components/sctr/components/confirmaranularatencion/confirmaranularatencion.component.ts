import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';

@Component({
  selector: 'app-confirmaranularatencion',
  templateUrl: './confirmaranularatencion.component.html',
  styleUrl: './confirmaranularatencion.component.scss'
})

export class ConfirmaranularatencionComponent {
  cod_historia_clinica: any;
  historiaClinica: HistoriaClinica = {} as HistoriaClinica;
  usuarioEnlinea: UsuarioAuth;

  constructor(public _dialogRef: MatDialogRef<ConfirmaranularatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _historiaClinicaServices: HistoriaClinicaService, private toastrService: ToastrService) {
    this.cod_historia_clinica = data.cod_historia_clinica
  }
  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  anularAtencion() {
    this.historiaClinica.cod_historia_clinica = this.cod_historia_clinica;
    this.historiaClinica.usuario_eliminacion = this.usuarioEnlinea.id || '';
    this._historiaClinicaServices.deleteHistoriaClinicaSctr(this.historiaClinica).subscribe({
      next: (val: any) => {
        this.toastrService.success('¡Atención anulada satisfactoriamene!');
        this._dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
}
