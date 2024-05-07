import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base/base.component';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuario-reset-password',
  templateUrl: './usuario-reset-password.component.html',
  styleUrl: './usuario-reset-password.component.scss'
})
export class UsuarioResetPasswordComponent extends BaseComponent implements OnInit 
{
  resetPasswordForm: UntypedFormGroup;

  constructor
  (
    private usuarioService: UsuarioService,
    private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<UsuarioResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private toastrService: ToastrService,
    // private translationService: TranslationService
  ) 
  {
    super();
  }

  ngOnInit(): void 
  {
    this.createResetPasswordForm();
    this.resetPasswordForm.get('usuario')?.setValue(this.data.usuario);
  }

  createResetPasswordForm() 
  {
    this.resetPasswordForm = this.fb.group({
      email: [],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: this.checkPasswords
    });
  }

  checkPasswords(group: UntypedFormGroup) 
  {
    let pass = group.get('password')?.value ;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  createBuildObject(): Usuario {
    return {
      email: '',
      contrasena: this.resetPasswordForm.get('contrasena')?.value,
      usuario: this.resetPasswordForm.get('usuario')?.value ,
    }
  }
}
