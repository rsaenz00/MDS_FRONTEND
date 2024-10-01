import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { PersonaGeneral } from 'src/app/models/persona.model';

import { Parametro } from 'src/app/models/parametro.model';
import { ParametroService } from 'src/app/services/parametro.service';
import { TipoDocumentoService } from "src/app/services/tipodocumento.service";
import { Pais } from 'src/app/models/pais.model';
import { PaisService } from 'src/app/services/pais.service';

import { ListadoubigeosComponent } from '../../../sctr/components/sctr-listado-ubigeos/listado-ubigeos.component';
import { PersonaService } from 'src/app/services/persona.service';
import { MadNuevaAtencionComponent } from '../nuevaatencion/mad-nuevaatencion.component';


@Component({
  selector: 'app-mad-nuevopaciente',
  templateUrl: './mad-nuevopaciente.component.html',
  styleUrl: './mad-nuevopaciente.component.scss'
})

export class NuevoPacienteComponent implements OnInit {

  codUbigeo='';
  usuarioEnlinea: UsuarioAuth;
  valGenero:0;
  valTipoDocumento:0;
  valPais:0;

  constructor(
              private _personaService: PersonaService,
              private _paisService: PaisService,
              private _tipodocumentoService: TipoDocumentoService,
              private _parametroService: ParametroService,
              private frm: FormBuilder, 
              private toastrService: ToastrService,
              private _dialog: MatDialog, 
              public _dialogRef: MatDialogRef<NuevoPacienteComponent>,
             // private _dialogoRef: MatDialogRef<MadNuevaAtencionComponent>,
            ) { }


  FormularioNuevoPaciente = this.frm.group({
    //txtAseguradora: [{ value: '', disabled: false }, Validators.required],
    //cboCategoria: [{ value: '', disabled: false }, Validators.required],
    txtNumero: [{ value: '', disabled: false }, Validators.required],
    txtNombres: [{ value: '', disabled: false }, Validators.required],
    txtPaterno: [{ value: '', disabled: false }, Validators.required],
    txtMaterno: [{ value: '', disabled: false }, Validators.required],
    txtEmail: [{ value: '', disabled: false }, Validators.required],
    txtFechaNacimiento: [{ value: '', disabled: false }, Validators.required],
    txtTelefonoCelular: [{ value: '', disabled: false }, Validators.required],
    txtEdad:[{ value: '', disabled: false }, Validators.required],
    cboPais: [{ value: '', disabled: false }, Validators.required],
    cboTipoDocumento: [{ value: '', disabled: false }, Validators.required],
    cboGenero: [{ value: '', disabled: false }, Validators.required],
    txtDepartamento: [{ value: '', disabled: false }, Validators.required],
    txtProvincia: [{ value: '', disabled: false }, Validators.required],
    txtDistrito: [{ value: '', disabled: false }, Validators.required],
    txtDireccion: [{ value: '', disabled: false }, Validators.required],
    txtTelefonoCasa: [{ value: '', disabled: false }, Validators.required],
  });
  //---------------------------------------------------
  generos: Parametro[];
  tipoDocumentos: Parametro[];
  paises: Pais[];
  //---------------------------------------------------
  paciente: PersonaGeneral = {} as PersonaGeneral;
  fechaNacimiento: any;
  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    //LLAMAR A LOS METODOS
    this.getGenerosList();
    this.getTipoDocumentoList();
    this.getPaisList();
  }
  //METODO PARA LISTAR TODOS LOS GENEROS
  getGenerosList() 
  {
    this._parametroService.GetParametro('1').subscribe({
      next: (res) => {
        this.generos = res.resultData;
      },
      error: console.log,
    });
  }
  getGenero(target: any) 
  {
    this.valGenero = target.value;
  }

//-----------------------------------------------------------------------------------
getTipoDocumentoList() 
{
    this._tipodocumentoService.GetTipoDocumentos().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
}

getTipoDocumento(target: any) 
{
    this.valTipoDocumento = target.value;
}
//-----------------------------------------------------------------------------------
getPaisList() 
{
    this._paisService.getPaises().subscribe({
      next: (res) => {
        this.paises = res.resultData;
      },
      error: console.log,
    });
}

getPais(target: any) 
{
    this.valPais = target.value;
}
  exitSalirPaciente() {
    this._dialogRef.close(true);
  }
  
  savePaciente() {
    if (this.FormularioNuevoPaciente.valid) {

      this.paciente.id_documento = this.valTipoDocumento;
      this.paciente.id_pais = this.valPais;
      this.paciente.id_ubigeo = this.codUbigeo;
      this.paciente.numero = this.FormularioNuevoPaciente.value["txtNumero"]?.toString() || '';
      this.paciente.nombres = this.FormularioNuevoPaciente.value["txtNombres"]?.toString() || '';
      this.paciente.paterno = this.FormularioNuevoPaciente.value["txtPaterno"]?.toString() || '';
      this.paciente.materno = this.FormularioNuevoPaciente.value["txtMaterno"]?.toString() || '';
      this.paciente.email = this.FormularioNuevoPaciente.value["txtEmail"]?.toString() || '';
      //this.fechaNacimiento = this.FormularioNuevoPaciente.value["txtFechaNacimiento"]?.toString();
      this.paciente.fechanacimiento = new Date();   //this.FormularioNuevoPaciente.value["txtFechaNacimiento"]?.toString() || ''; //new Date(this.fechaNacimiento);
      this.paciente.genero = "1";//true;
      this.paciente.direccion = this.FormularioNuevoPaciente.value["txtDireccion"]?.toString() || '';
      this.paciente.usuariocreacion = 9; // this.usuarioEnlinea.id || '';
      this.paciente.telefonocasa = this.FormularioNuevoPaciente.value["txtTelefonoCasa"]?.toString() || '';
      this.paciente.telefonocelular = this.FormularioNuevoPaciente.value["txtTelefonoCelular"]?.toString() || '';
      this._personaService.addPersonaMad(this.paciente).subscribe({
      next: (val: any) => {
        this.toastrService.success('Paciente Registrado correctamente!');
        this._dialog.open(MadNuevaAtencionComponent,{
            data: this.paciente,
            panelClass: 'sanna_theme',
            width: '1800px',
          });
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  openUbigeoDialog() {
    const dialogRef = this._dialog.open(ListadoubigeosComponent, {
      disableClose: true,
      panelClass: 'sanna_theme',
      width: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.codUbigeo = result.data.codigo;
      this.FormularioNuevoPaciente.controls['txtDepartamento'].setValue(result.data.departamento);
      this.FormularioNuevoPaciente.controls['txtProvincia'].setValue(result.data.provincia);
      this.FormularioNuevoPaciente.controls['txtDistrito'].setValue(result.data.distrito);
    });
  }
  
}