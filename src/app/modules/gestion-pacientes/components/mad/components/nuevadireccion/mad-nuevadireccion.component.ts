import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { HClinica,PacienteDistrito } from 'src/app/models/historia_clinica.model';
import { HistoriaClinicaService } from 'src/app/services/historia_clinica.service';
import { Direccion, ListadoDirecciones } from 'src/app/models/direccion.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { Ubigeos,Departamento,Provincia,Distrito,UbigeoCodigo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-mad-nuevadireccion',
  templateUrl: './mad-nuevadireccion.component.html',
  styleUrl: './mad-nuevadireccion.component.scss'
})

export class NuevaDireccionComponent implements OnInit {
  usuarioEnlinea: UsuarioAuth;
  countRows: number = 0;
  positionRow: number;
  displayedColumns = ['paciente', 'tipo', 'direccion'];
  dataSource!: MatTableDataSource<ListadoDirecciones>;
  showSpinner = true;
  rowStyle: string = "";
  footerToDisplayed: string[] = ["footer"];
  codUbigeo='';
  valDepartamento='';
  valProvincia='';
  valDistrito='';
  valTipoDireccion=0;
  valGenero:0;
  valTipoDocumento:0;
  valPais:0;
  vDepartamento='';
  vProvincia='';
  vDistrito='';
  vCodigoPersona: any;
  vNombreDepartamento='';
  vNombreProvincia='';
  vNombreDistrito='';
  constructor(
              private _ubigeoService: UbigeoService,
              private _liveAnnouncer: LiveAnnouncer,
              private dataAdapter: DateAdapter<Date>,
              private _direccionService: DireccionService,
              private _historiaclinica: HistoriaClinicaService,
              private _personaService: PersonaService,
              private _paisService: PaisService,
              private _tipodocumentoService: TipoDocumentoService,
              private _parametroService: ParametroService,
              private frm: FormBuilder, 
              private toastrService: ToastrService,
              private _dialog: MatDialog, 
              public _dialogRef: MatDialogRef<MadNuevaAtencionComponent>, 
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
            )
             {   
              this.vCodigoPersona = data.idpersona;
              this.dataAdapter.setLocale("es-pe");
             }

@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;

FormularioNuevaDireccion = this.frm.group({    
txtDepartamento: [{ value: '', disabled: false }],//, Validators.required    
txtProvincia: [{ value: '', disabled: false }], //, Validators.required    
txtDistrito: [{ value: '', disabled: false }],//, Validators.required    
cboTipoDireccion: [{ value: '', disabled: false }],//, Validators.required    
txtDireccion: [{ value: '', disabled: false }],//, Validators.required    
txtNumero: [{ value: '', disabled: false }],//, Validators.required    
txtInterior: [{ value: '', disabled: false }],//, Validators.required    
txtUrbanizacion: [{ value: '', disabled: false }],//, Validators.required    
txtReferencia: [{ value: '', disabled: false }],//, Validators.required    
txtTelefonofijo: [{ value: '', disabled: false }],//, Validators.required    
txtTelefonooficina: [{ value: '', disabled: false }],//, Validators.required    
txtCelular: [{ value: '', disabled: false }],//, Validators.required    
});
FormularioFiltroDireccion = this.frm.group({
    txtPaciente: [''],
    txtTipo: [''],
    txtDireccion: [''],
}); 
  //---------------------------------------------------
  //ubigeos: Ubigeos[];
  departamentos: Departamento[];
  provincias: Provincia[];
  distritos: Distrito[];
  ubigeos: PacienteDistrito[];
  codigoubigeo: UbigeoCodigo[];
  tipoDirecciones: Parametro[];
  generos: Parametro[];
  tipoDocumentos: Parametro[];
  paises: Pais[];
  //---------------------------------------------------
  paciente: PersonaGeneral = {} as PersonaGeneral;
  fechaNacimiento: any;
  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    //LLAMAR A LOS METODOS
    if(this.vCodigoPersona != '')
    {
      this.getDireccionList(this.vCodigoPersona);
    }
    this.getDepartamentoList();
    this.getTipoDireccionList(); 
  }
    //ORDENAR TABLA
    announceSortChange(sortState: Sort) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      }
      else {
        this._liveAnnouncer.announce(`Sorting cleared`);
      }
    }
    //LISTADO DE DIRECCIONES
    getDireccionList(vCodPersona: string) {
    this.displayedColumns = ['paciente', 'tipo', 'direccion'];
    this._direccionService.getDireccionLista(vCodPersona).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }
//-------------------------------------------------------------------METODOS---------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------DEPARTAMENTO---------------------------------------------------
getDepartamentoList() 
{
    this._ubigeoService.getDepartamentoList().subscribe({
      next: (res) => {
        this.departamentos = res.resultData;
      },
      error: console.log,
    });
}
getDepartamento(target: any) 
{
    this.valDepartamento = target.value;
    this.getProvinciaList(this.valDepartamento);
}
//-------------------------------------------------------------------PROVINCIA---------------------------------------------------
getProvinciaList(vCodigoDepartamento: string) 
{
    this._ubigeoService.getProvinciaList(vCodigoDepartamento).subscribe({
      next: (res) => {
        this.provincias = res.resultData;
      },
      error: console.log,
    });
}
getProvincia(target: any) 
{
    this.valProvincia = target.value;
    this.getDistritoList(this.valDepartamento,this.valProvincia);
}
//-------------------------------------------------------------------DISTRITO---------------------------------------------------
getDistritoList(vCodigoDepartamento: string,vCodigoProvincia: string) 
{
    this._ubigeoService.getDistritoList(vCodigoDepartamento,vCodigoProvincia).subscribe({
      next: (res) => {
        this.distritos = res.resultData;
        //for(let option of this.distritos)
        //{
        //  this.vNombreDistrito = option.nombre;
        //  alert(this.vNombreDistrito);
        //}
        //this.vNombreDistrito = this.distritos[0].nombre;
      },
      error: console.log,
    });
}
getDistrito(target: any) 
{
  this.valDistrito = target.value;
  this._ubigeoService.getUbigeoCodigoList(this.valDepartamento,this.valProvincia,this.valDistrito).subscribe({
    next:(res)=>{
      this.codUbigeo = res.resultData[0].codigo_ubigeo;
    }
  })
}
verDistrito(distrito: Distrito): string 
{
  return distrito && distrito.nombre ? distrito.nombre.trim() : '';
}
//------------------------------------------------------------TIPO DIRECCION---------------------------------------------------
getTipoDireccionList() 
{
    this._parametroService.GetParametro('2').subscribe({
      next: (res) => {
        this.tipoDirecciones = res.resultData;
      },
      error: console.log,
    });
}
getTipoDireccion(target: any) 
{
    this.valTipoDireccion = target.value;
}
exitSalirDireccion()
{
  this._dialogRef.close(true);
}
direccion: Direccion = {} as Direccion;
saveDireccion(){
  if(this.FormularioNuevaDireccion.valid)
  {
    this.direccion.id_persona = this.vCodigoPersona;
    this.direccion.id_ubigeo = this.codUbigeo;
    this.direccion.id_tipo_direccion =    parseInt(this.FormularioNuevaDireccion.value["cboTipoDireccion"]?.toString() || '');
    this.direccion.descripcion =     this.FormularioNuevaDireccion.value["txtDireccion"]?.toString() || '';
    this.direccion.anexo =   this.FormularioNuevaDireccion.value["txtTelefonofijo"]?.toString() || '';
    this.direccion.celular = this.FormularioNuevaDireccion.value["txtCelular"]?.toString() || '';
    this.direccion.telefono_fijo = this.FormularioNuevaDireccion.value["txtTelefonooficina"]?.toString() || '';
    this.direccion.nro_mz_lote = this.FormularioNuevaDireccion.value["txtNumero"]?.toString() || '';
    this.direccion.urbanizacion = this.FormularioNuevaDireccion.value["txtUrbanizacion"]?.toString() || '';
    this.direccion.referencia = this.FormularioNuevaDireccion.value["txtReferencia"]?.toString() || '';
    this.direccion.dpto_interior = this.FormularioNuevaDireccion.value["txtInterior"]?.toString() || '';
    this.direccion.usuario_creacion = this.usuarioEnlinea.id || '';
    this._direccionService.addDireccion(this.direccion).subscribe({
    next: (val: any) => {
          this.toastrService.success('La Direccion se Registro correctamente!');
          this.getDireccionList(this.vCodigoPersona);
          this._dialogRef.close({
            data: {
                   'CodigoUbigeo' : this.codUbigeo,
                   'direccion': this.direccion.descripcion, 
                   'urbanizacion': this.direccion.urbanizacion,
                   'referencia': this.direccion.referencia,
                   'numero': this.direccion.nro_mz_lote,
                   'interior': this.direccion.dpto_interior,
                   'anexo': this.direccion.anexo,
                   'celular': this.direccion.celular, 
                  }
          });
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  else
  {
    this.toastrService.warning('¡Por favor complete los campos obligatorios!');
  }       
  }
}



