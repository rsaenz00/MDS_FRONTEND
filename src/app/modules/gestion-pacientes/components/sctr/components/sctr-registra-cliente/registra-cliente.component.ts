import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/models/cliente.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { ClienteService } from 'src/app/services/cliente.service';
import { limpiarNumero, soloNumeros } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-registra-cliente',
  templateUrl: './registra-cliente.component.html',
  styleUrl: './registra-cliente.component.scss'
})

export class RegistraclienteComponent {
  usuarioEnlinea: UsuarioAuth;

  constructor(private _clienteService: ClienteService, private frm: FormBuilder, private toastrService: ToastrService, public _dialogRef: MatDialogRef<RegistraclienteComponent>) { }

  formularioNuevoClienteSctr = this.frm.group({
    txtNombre: [{ value: '', disabled: false }, Validators.required],
    txtRuc: [{ value: '', disabled: false }, Validators.required]
  });

  cliente: Cliente = {} as Cliente;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
  }

  exitRegistrarCliente() {
    this._dialogRef.close(true);
  }

  saveCliente() {
    if (this.formularioNuevoClienteSctr.valid) {
      this.cliente.nombre = this.formularioNuevoClienteSctr.value["txtNombre"]?.toString() || '';
      this.cliente.ruc = this.formularioNuevoClienteSctr.value["txtRuc"]?.toString() || '';
      this.cliente.usuario_creacion = this.usuarioEnlinea.id || '';

      //console.log(this.cliente)

      this._clienteService.addClienteSctr(this.cliente).subscribe({
        next: (res: any) => {
          if (res.resultData.id_cliente == -1) {
            this.toastrService.warning('¡El Cliente con RUC número: ' + this.cliente.ruc + ' ya existe!');
          } else {
            this.toastrService.success('Cliente creado satisfactoriamente!');
            this._dialogRef.close({
              data: this.cliente
            });
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

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

}