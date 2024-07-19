import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators, UntypedFormGroup } from '@angular/forms';
import { MaterialModule } from '../../../../material.module';
import { CoreService } from '../../../../services/core.service';
import { BaseComponent } from 'src/app/base/base.component';
import { SecurityService } from 'src/app/helpers/security/security.service';
import { ToastrService } from 'ngx-toastr';
import { SignalrService } from 'src/app/helpers/signalr/signalr.service';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { UsuarioEnlinea } from 'src/app/models/usuario-enlinea';
import { CommonError } from 'src/app/helpers/error-handler/common-error';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule, TablerIconsModule],
})
export class LoginComponent extends BaseComponent implements OnInit {
  options = this.settings.getOptions();
  loginFormGroup: UntypedFormGroup;
  lat: number;
  lng: number;
  isLoading = false;
  statusBtnIniciarSesion = false;
  lblBtnIniciarSesion = "Iniciar Sesion";

  constructor
    (
      private settings: CoreService,
      private formBuilder: UntypedFormBuilder,
      private router: Router,
      private securityService: SecurityService,
      private toastr: ToastrService,
      // private authService: SocialAuthService,
      // private signalrService: SignalrService
    ) {
    super();
  }

  get formControl() {
    return this.loginFormGroup.controls;
  }

  createFormGroup(): void {
    this.loginFormGroup = this.formBuilder.group({
      usuario: ['', [Validators.required, Validators.maxLength(15)]],
      contrasena: ['', [Validators.required]]
    });
  }

  onRegistrationClick(): void {
    this.router.navigate(['/auth/register']);
  }

  onLoginSubmit() {
    if (this.loginFormGroup.valid) {
      this.isLoading = true;
      this.statusBtnIniciarSesion = true;
      this.lblBtnIniciarSesion = "Cargando";
      // var userObject = Object.assign(this.loginFormGroup.value, { latitude: this.lat, longitude: this.lng });
      var userObject = Object.assign(this.loginFormGroup.value);
      this.sub$.sink = this.securityService.login(userObject)
        .subscribe(
          (c: any) => {
            const userInfo: UsuarioEnlinea = {
              usuario: c.usuario,
              id: c.id,
              connectionId: ''
            }
            // this.signalrService.addUser(userInfo);
            this.isLoading = false;
            this.statusBtnIniciarSesion = false;
            this.lblBtnIniciarSesion = "Iniciar Sesion";
            this.toastr.success('Usuario logeado satisfactoriamente.');
            // admin-lte issue for side bar https://github.com/ColorlibHQ/AdminLTE/issues/3599
            window.location.href = "/";
          },
          (err: CommonError) => {
            this.isLoading = false;
            this.statusBtnIniciarSesion = false;
            this.lblBtnIniciarSesion = "Iniciar Sesion";
            this.toastr.error('Usuario y clave incorrectos.');
            if (err.messages) {
              //console.log(err.messages)
              err.messages.forEach(msg => {
                //this.toastr.error(msg);
              });
            } else if (err.error) {
              //this.toastr.error(err.error as string);
              //console.log(err.error)
            }
          }
        );


    }
  }

  ngOnInit(): void {
    this.createFormGroup();
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
  }
}
