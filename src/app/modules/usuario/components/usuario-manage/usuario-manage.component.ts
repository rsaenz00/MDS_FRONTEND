import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Parametro } from 'src/app/models/parametro.model';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { PersonasSinUsuario, Usuario } from 'src/app/models/usuario';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { ParametroService } from 'src/app/services/parametro.service';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { limpiarLetras, limpiarNumero, primer9, rellenaCaracteres, soloDecimales, soloLetras, soloNumeros, validarEmail } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-usuario-manage',
  templateUrl: './usuario-manage.component.html',
  styleUrl: './usuario-manage.component.scss'
})

export class UsuarioManageComponent implements OnInit {
  usuarioEnlinea: UsuarioAuth;
  filtradoPersonasSinUsuario: PersonasSinUsuario[];
  usuario: Usuario = {} as Usuario;
  tipoDocumentos: TipoDocumento[];
  sexos: Parametro[];

  valPersona: string;
  valTipoDocumento: string;
  valSexo: string;
  tituloFormulario: string;
  codPersona: number;
  codUsuario: number;
  statusBtnFiltrar = true;
  showSpinner = false;
  crearPersona = false;
  fechaNacimiento: any;

  @ViewChild("txtPersona") txtPersona: ElementRef;
  @ViewChild("txtNombreUsuario") txtNombreUsuario: ElementRef;
  @ViewChild("txtClave") txtClave: ElementRef;

  constructor
    (
      private frm: FormBuilder,
      private toastrService: ToastrService,
      public _dialogRef: MatDialogRef<UsuarioManageComponent>,
      private _usuarioService: UsuarioService,
      private _tipoDocumentoService: TipoDocumentoService,
      private _parametroService: ParametroService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
      private dateAdapter: DateAdapter<Date>
    ) {
    this.dateAdapter.setLocale("es-pe");
    this.codUsuario = data.userId;
    this.codPersona = data.personaId;
  }

  frmUsuario = this.frm.group({
    txtPersona: ['', Validators.required],
    txtNombreUsuario: ['', Validators.required],
    txtClave: ['', Validators.required],
    txtEmailCorp: ['', Validators.required],
    txtTelefCorp: ['', Validators.required],
    txtApePaterno: [{ value: '', disabled: true }, Validators.required],
    txtApeMaterno: [{ value: '', disabled: true }, Validators.required],
    txtNombres: [{ value: '', disabled: true }, Validators.required],
    cboTipoDocumento: [{ value: 2, disabled: true }, Validators.required],
    txtNroDocumento: [{ value: '', disabled: true }, Validators.required],
    txtFechaNacimiento: [{ value: new Date(1900, 0, 1), disabled: true }, Validators.required],
    cboSexo: [{ value: 1, disabled: true }, Validators.required]
  });

  ngOnInit() {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.getTipoDocumentosList();
    this.getSexosList();

    if (this.codUsuario == 0 || this.codUsuario == null) {
      this.tituloFormulario = "Registro de usuario nuevo";
      this.showSpinner = false;
    } else {
      this.tituloFormulario = "Modificar usuario";
      this.nuevaPersona();
      this.precargarUsuario(this.codUsuario);
    }
  }

  precargarUsuario(userId: number) {
    this.crearPersona = true;

    this._usuarioService.GetUsuario(userId).subscribe({
      next: (res) => {
        //console.log(res.resultData[0])
        this.codPersona = res.resultData[0].id_persona;
        this.codUsuario = res.resultData[0].codigoUsuario;
        this.frmUsuario.controls['txtNroDocumento'].setValue(res.resultData[0].numero_documento);
        this.frmUsuario.controls['txtApePaterno'].setValue(res.resultData[0].apellidoPaterno);
        this.frmUsuario.controls['txtApeMaterno'].setValue(res.resultData[0].apellidoMaterno);
        this.frmUsuario.controls['txtNombres'].setValue(res.resultData[0].nombres);
        this.frmUsuario.controls['txtNombreUsuario'].setValue(res.resultData[0].usuario);
        this.frmUsuario.controls['txtClave'].setValue(res.resultData[0].contrasena);
        this.frmUsuario.controls['txtEmailCorp'].setValue(res.resultData[0].email);
        this.frmUsuario.controls['txtTelefCorp'].setValue(res.resultData[0].telefonoMovil);
        this.fechaNacimiento = new Date(res.resultData[0].fecha_nacimiento);
        this.getSexo(null, res.resultData[0].sexo);
        this.getTipoDocumento(null, res.resultData[0].tipo_documento);
      },
      error: console.log,
    });
  }

  getSexosList() {
    this._parametroService.GetParametro('1').subscribe({
      next: (res) => {
        this.sexos = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDocumentosList() {
    this._tipoDocumentoService.GetTipoDocumentos().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
  }

  getSexo(target: any, value) {
    if (value == null) {
      this.valSexo = target.value;
    } else {
      this.valSexo = value;
    }
  }

  preFiltro() {
    const ds = this.frmUsuario.value["txtPersona"]?.toString() || '';
    if (ds == '') {
      this.statusBtnFiltrar = true;
    } else {
      this.statusBtnFiltrar = false;
    }
  }

  filterClientes() {
    this.statusBtnFiltrar = true;
    this.showSpinner = true;
    const ds = this.frmUsuario.value["txtPersona"]?.toString() || '';
    this._usuarioService.GetPersonasSinUsuario(ds).subscribe({
      next: (res) => {
        this.statusBtnFiltrar = false;
        this.showSpinner = false;
        if (res.resultData) {
          this.filtradoPersonasSinUsuario = res.resultData;
        } else {
          this.toastrService.warning('¡No se encontró a la persona!');
        }
        this.txtPersona.nativeElement.focus();
      },
      error: console.log,
    });
  }

  limpiarCaja() {
    this.frmUsuario.controls['txtPersona'].reset();
    this.statusBtnFiltrar = true;
    this.filtradoPersonasSinUsuario = [];
  }

  selectPersona(option: MatOption) {
    this.codPersona = option.value.id_persona;
    this.statusBtnFiltrar = true;
    this.filtradoPersonasSinUsuario = [];
    this.txtNombreUsuario.nativeElement.focus();

    this.autogenerarUsuarioCorreo(option.value.nombres, option.value.apellido_paterno);
  }

  autogenerarUsuarioCorreo(nombres: string, apellido_paterno: string) {
    if (nombres != '' && apellido_paterno != '') {
      var nombrecortado = nombres.split(" ");
      var primernombre = nombrecortado[0];

      this.frmUsuario.controls['txtEmailCorp'].setValue((primernombre + "." + apellido_paterno + "@sanna.pe").toLowerCase());
      this.frmUsuario.controls['txtNombreUsuario'].setValue((primernombre.charAt(0) + apellido_paterno).toUpperCase());
    } else {
      this.frmUsuario.controls['txtEmailCorp'].setValue('');
      this.frmUsuario.controls['txtNombreUsuario'].setValue('');
    }
  }

  validaAutogenera() {
    let nombres = this.frmUsuario.value["txtNombres"]?.toString() || '';
    let apellidoPaterno = this.frmUsuario.value["txtApePaterno"]?.toString() || '';
    this.autogenerarUsuarioCorreo(nombres, apellidoPaterno);
  }

  verPersona(persona: PersonasSinUsuario): string {
    return persona && persona.id_persona ? persona.nombres + " " + persona.apellido_paterno + " " + persona.apellido_materno : '';
  }

  saveUser() {
    this.showSpinner = true;
    let expr = /(?=.*[0-9a-zA-Z]{8,})/;
    let pass = this.frmUsuario.value["txtClave"] || '';
    if (this.codPersona == null && this.crearPersona == false) {
      this.showSpinner = false;
      this.txtNombreUsuario.nativeElement.focus();
      this.toastrService.warning('¡Por favor seleccione una persona!');
      this.validateAllFormFields(this.frmUsuario);
    } else if (!expr.test(pass)) {
      this.showSpinner = false;
      this.txtClave.nativeElement.focus();
      this.toastrService.warning('¡Por favor valide que la clave cumpla mínimo 8 caracteres, con al menos una letra y un número, sin caracteres especiales!');
      this.validateAllFormFields(this.frmUsuario);
    } else if (this.frmUsuario.valid) {
      if (this.codUsuario) {
      }

      if (this.codPersona == null) {
        this.usuario.id_usuario = this.codUsuario.toString();
      }

      if (this.codUsuario == null && this.crearPersona == true) {
        this.usuario.tipo_documento = this.valTipoDocumento.toString();
        this.usuario.numero_documento = this.frmUsuario.value["txtNroDocumento"]?.toString() || '';
        this.usuario.nombres = this.frmUsuario.value["txtNombres"]?.toString() || '';
        this.usuario.apellidoMaterno = this.frmUsuario.value["txtApeMaterno"]?.toString() || '';
        this.usuario.apellidoPaterno = this.frmUsuario.value["txtApePaterno"]?.toString() || '';
        this.usuario.sexo = this.valSexo.toString();
        this.fechaNacimiento = this.frmUsuario.value["txtFechaNacimiento"]?.toString();
        this.usuario.fecha_nacimiento = new Date(this.fechaNacimiento);
      }

      if (this.codUsuario != null) {
        this.usuario.id_usuario = this.codUsuario.toString();
        this.usuario.sexo = this.valSexo.toString();
        this.fechaNacimiento = this.frmUsuario.value["txtFechaNacimiento"]?.toString();
        this.usuario.fecha_nacimiento = new Date(this.fechaNacimiento);
      }

      this.usuario.id_persona = this.codPersona.toString();
      this.usuario.usuario = this.frmUsuario.value["txtNombreUsuario"] || '';
      this.usuario.contrasena = this.frmUsuario.value["txtClave"] || '';
      this.usuario.email = this.frmUsuario.value["txtEmailCorp"] || '';
      this.usuario.telefonoMovil = this.frmUsuario.value["txtTelefCorp"] || '';

      if (this.codUsuario) {
        this.usuario.usuario_modificacion = this.usuarioEnlinea.id?.toString() || '';
        this._usuarioService.UpdateUsuario(this.usuario).subscribe({
          next: (res: any) => {
            this.showSpinner = false;
            this.toastrService.success('¡Se ha actualizado el usuario de forma satisfactoria');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            this.showSpinner = false;
            this.toastrService.error('¡No se ha podido actualizar el usuario');
            console.error(err);
          },
        });
      } else {
        this.usuario.usuario_creacion = this.usuarioEnlinea.id?.toString() || '';
        if (this.crearPersona == true) {
          this._usuarioService.AddUsuarioPersona(this.usuario).subscribe({
            next: (res: any) => {
              if (res.resultData.id_persona == -1) {
                this.showSpinner = false;
                this.toastrService.warning('¡La persona con número de documento: ' + this.usuario.numero_documento + ' ya existe!');
              } else {
                this.showSpinner = false;
                this.toastrService.success('¡Se ha creado el usuario de forma satisfactoria (2)');
                this._dialogRef.close(true);
              }
            },
            error: (err: any) => {
              this.showSpinner = false;
              this.toastrService.error('¡No se ha podido crear el usuario (2)');
              console.error(err);
            },
          });
        } else {
          this._usuarioService.AddUsuario(this.usuario).subscribe({
            next: (res: any) => {
              this.showSpinner = false;
              this.toastrService.success('¡Se ha creado el usuario de forma satisfactoria (1)');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              this.showSpinner = false;
              this.toastrService.error('¡No se ha podido crear el usuario (1)');
              console.error(err);
            },
          });
        }
      }
    } else {
      this.showSpinner = false;
      this.validateAllFormFields(this.frmUsuario);
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  exitGestionUsuario() {
    this.frmUsuario.reset();
    this._dialogRef.close(true);
  }

  nuevaPersona() {
    if (this.crearPersona) {
      this.crearPersona = false;
      this.frmUsuario.controls['txtPersona'].enable();

      this.frmUsuario.controls['cboTipoDocumento'].disable();
      this.frmUsuario.controls['txtNroDocumento'].disable();
      this.frmUsuario.controls['txtApePaterno'].disable();
      this.frmUsuario.controls['txtApeMaterno'].disable();
      this.frmUsuario.controls['txtNombres'].disable();
      this.frmUsuario.controls['txtFechaNacimiento'].disable();
      this.frmUsuario.controls['cboSexo'].disable();
      this.frmUsuario.controls['txtNombreUsuario'].disable();
    } else {
      this.crearPersona = true;
      this.codPersona = 0;
      this.frmUsuario.controls['txtPersona'].disable();
      this.statusBtnFiltrar = true;

      if (this.codUsuario) {
        this.frmUsuario.controls['cboTipoDocumento'].disable();
        this.frmUsuario.controls['txtNroDocumento'].disable();
        this.frmUsuario.controls['txtApePaterno'].disable();
        this.frmUsuario.controls['txtApeMaterno'].disable();
        this.frmUsuario.controls['txtNombres'].disable();
        this.frmUsuario.controls['txtNombreUsuario'].disable();
        this.frmUsuario.controls['txtFechaNacimiento'].enable();
        this.frmUsuario.controls['cboSexo'].enable();
      } else {
        this.frmUsuario.controls['cboTipoDocumento'].enable();
        this.frmUsuario.controls['txtNroDocumento'].enable();
        this.frmUsuario.controls['txtApePaterno'].enable();
        this.frmUsuario.controls['txtApeMaterno'].enable();
        this.frmUsuario.controls['txtNombres'].enable();
        this.frmUsuario.controls['txtFechaNacimiento'].enable();
        this.frmUsuario.controls['cboSexo'].enable();

        this.frmUsuario.controls['txtNroDocumento'].reset();
        this.frmUsuario.controls['txtApePaterno'].reset();
        this.frmUsuario.controls['txtApeMaterno'].reset();
        this.frmUsuario.controls['txtNombres'].reset();
      }
    }
  }

  getTipoDocumento(target: any, value) {
    if (value == null) {
      this.valTipoDocumento = target.value;
    } else {
      this.valTipoDocumento = value;
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  soloNumeros(event: Event): boolean {
    return soloNumeros(event);
  }

  soloDecimales(event: Event): boolean {
    return soloDecimales(event);
  }

  soloLetras(event: Event): boolean {
    return soloLetras(event);
  }

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

  limpiarLetras(event: Event): boolean {
    return limpiarLetras(event);
  }

  rellenaCaracteres(event: Event): boolean {
    return rellenaCaracteres(event);
  }

  primer9(event: Event): boolean {
    return primer9(event);
  }

  validarEmail(event: Event): boolean {
    return validarEmail(event);
  }

}