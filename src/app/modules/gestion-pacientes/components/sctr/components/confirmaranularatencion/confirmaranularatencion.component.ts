import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Atencion } from 'src/app/models/atencion.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { AtencionService } from 'src/app/services/atencion.service';

@Component({
  selector: 'app-confirmaranularatencion',
  templateUrl: './confirmaranularatencion.component.html',
  styleUrl: './confirmaranularatencion.component.scss'
})

export class ConfirmaranularatencionComponent {
  id_atencion: any;
  atencion: Atencion = {} as Atencion;
  usuarioEnlinea: UsuarioAuth;

  constructor(public _dialogRef: MatDialogRef<ConfirmaranularatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _atencionServices: AtencionService, private toastrService: ToastrService) {
    this.id_atencion = data.id_atencion
  }
  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  anularAtencion() {
    this.atencion.id_atencion = this.id_atencion;
    this.atencion.usuario_eliminacion = this.usuarioEnlinea.id || '';
    this._atencionServices.deleteAtencionSctr(this.atencion).subscribe({
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
