import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MadNuevaAtencionComponent } from '../nuevaatencion/mad-nuevaatencion.component';

@Component({
  selector: 'app-mad-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrl: './mensaje.component.scss'
})

export class MensajeComponent {
    vMensaje: any;
    vMensajePersonas: any;
    vMensajeEspecialidades: any;
    vMensajeRegistroMad = '';
    vMensajeRegistroPaciente = '';
    vMensajeRegistroEspecialidad = '';
  constructor(
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    private frm: FormBuilder,
    public _dialogRef: MatDialogRef<MensajeComponent>, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) 
    { 
      this.vMensaje = data.vMensaje;
      this.vMensajePersonas = data.vMensajePersona;
      this.vMensajeEspecialidades = data.vMensajeDoctor;
    }
  ngOnInit(): void {
    if(this.vMensaje !='' && this.vMensajePersonas != '' && this.vMensajeEspecialidades != '')
    {
      this.vMensajeRegistroMad = this.vMensaje;
      this.vMensajeRegistroPaciente = this.vMensajePersonas;
      this.vMensajeRegistroEspecialidad = this.vMensajeEspecialidades;
    }
  }
  Salir()
  {
    this._dialogRef.close(true);
  }
  Aceptar()
  {
    this._dialogRef.close(true);
    this._dialogRef.close({MadNuevaAtencionComponent});
  }
}