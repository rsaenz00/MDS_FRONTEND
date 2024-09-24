import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DateAdapter } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { PersonaGeneral } from 'src/app/models/persona.model';
import { Parametro } from 'src/app/models/parametro.model';
import { ParametroService } from 'src/app/services/parametro.service';
import { Pais } from 'src/app/models/pais.model';
import { PacienteDistrito } from 'src/app/models/historiaclinica.model';
import { Direccion, ListadoDirecciones } from 'src/app/models/direccion.model';
import { DireccionService } from 'src/app/services/direccion.service';
import { Departamento, Provincia, Distrito, UbigeoCodigo } from 'src/app/models/ubigeo.model';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { limpiarLetras, limpiarNumero, primer9, soloLetras, soloNumeros } from 'src/app/util/forms.validate';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-amb-mantenimiento-direcciones',
  templateUrl: './amb-mantenimiento-direcciones.component.html',
  styleUrl: './amb-mantenimiento-direcciones.component.scss'
})

export class AmbMantenimientoDireccionesComponent implements OnInit {
  options = this.settings.getOptions();
  usuarioEnlinea: UsuarioAuth;
  countRows: number = 0;
  positionRow: number;
  displayedColumns = ['paciente', 'tipo', 'direccion'];
  dataSource!: MatTableDataSource<ListadoDirecciones>;
  footerToDisplayed: string[] = ["footer"];
  rowStyle: string = "";
  codUbigeo = '';
  valDepartamento = '';
  valProvincia = '';
  valDistrito = '';
  vDepartamento = '';
  vProvincia = '';
  vDistrito = '';
  valTipoDireccion = 0;
  valGenero: 0;
  valTipoDocumento: 0;
  valPais: 0;
  codDireccion: number;
  codPaciente: any;
  showSpinner = true;
  statusBtnNueva = false;
  statusBtnGuardar = true;
  statusBtnCancelar = true;

  constructor(
    private settings: CoreService,
    private _ubigeoService: UbigeoService,
    private _liveAnnouncer: LiveAnnouncer,
    private dataAdapter: DateAdapter<Date>,
    private _direccionService: DireccionService,
    private _parametroService: ParametroService,
    private frm: FormBuilder,
    private toastrService: ToastrService,
    public _dialogRef: MatDialogRef<AmbMantenimientoDireccionesComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.codPaciente = data.id_persona;
    this.dataAdapter.setLocale("es-pe");
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  FormularioNuevaDireccion = this.frm.group({
    cboDepartamento: [{ value: '', disabled: true }, Validators.required],
    cboProvincia: [{ value: '', disabled: true }, Validators.required],
    cboDistrito: [{ value: '', disabled: true }, Validators.required],
    cboTipoDireccion: [{ value: '', disabled: true }],
    txtDireccion: [{ value: '', disabled: true }, Validators.required],
    txtNumero: [{ value: '', disabled: true }],
    txtInterior: [{ value: '', disabled: true }],
    txtUrbanizacion: [{ value: '', disabled: true }],
    txtReferencia: [{ value: '', disabled: true }, Validators.required],
    txtTelefonofijo: [{ value: '', disabled: true }],
    txtAnexo: [{ value: '', disabled: true }],
    txtCelular: [{ value: '', disabled: true }, Validators.required],
    txtAccion: [{ value: '', disabled: false }],
  });

  departamentos: Departamento[];
  provincias: Provincia[];
  distritos: Distrito[];
  ubigeos: PacienteDistrito[];
  codigoubigeo: UbigeoCodigo[];
  tipoDirecciones: Parametro[];
  generos: Parametro[];
  tipoDocumentos: Parametro[];
  paises: Pais[];
  paciente: PersonaGeneral = {} as PersonaGeneral;
  direccion: Direccion = {} as Direccion;
  fechaNacimiento: any;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.getDireccionList();
    this.getDepartamentoList();
    this.getTipoDireccionList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    }
    else {
      this._liveAnnouncer.announce(`Sorting cleared`);
    }
  }

  getDireccionList() {
    this.displayedColumns = ['tipo_direccion', 'descripcion', 'nro_mz_lote', 'urbanizacion', 'referencia'];
    this._direccionService.getDireccionesList(this.codPaciente).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  getDepartamentoList() {
    this._ubigeoService.getDepartamentoList().subscribe({
      next: (res) => {
        this.departamentos = res.resultData;
      },
      error: console.log,
    });
  }

  getDepartamento(target: any) {
    this.valDepartamento = target.value;
    this.getProvinciaList(this.valDepartamento);
  }

  getProvinciaList(vCodigoDepartamento: string) {
    this._ubigeoService.getProvinciaList(vCodigoDepartamento).subscribe({
      next: (res) => {
        this.provincias = res.resultData;
      },
      error: console.log,
    });
  }

  getProvincia(target: any) {
    this.valProvincia = target.value;
    this.getDistritoList(this.valDepartamento, this.valProvincia);
  }

  getDistritoList(vCodigoDepartamento: string, vCodigoProvincia: string) {
    this._ubigeoService.getDistritoList(vCodigoDepartamento, vCodigoProvincia).subscribe({
      next: (res) => {
        this.distritos = res.resultData;
      },
      error: console.log,
    });
  }

  getDistrito(target: any) {
    this.valDistrito = target.value;
    this._ubigeoService.getUbigeoCodigoList(this.valDepartamento, this.valProvincia, this.valDistrito).subscribe({
      next: (res) => {
        this.codUbigeo = res.resultData[0].codigo_ubigeo;
      }
    })
  }

  getTipoDireccionList() {
    this._parametroService.GetParametro('2').subscribe({
      next: (res) => {
        this.tipoDirecciones = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDireccion(target: any) {
    this.valTipoDireccion = target.value;
  }

  exitSalirDireccion() {
    this._dialogRef.close(true);
  }

  getRowSelected(row: Direccion) {
    this.FormularioNuevaDireccion.controls['txtDireccion'].enable();
    this.FormularioNuevaDireccion.controls['txtNumero'].enable();
    this.FormularioNuevaDireccion.controls['txtInterior'].enable();
    this.FormularioNuevaDireccion.controls['txtUrbanizacion'].enable();
    this.FormularioNuevaDireccion.controls['txtReferencia'].enable();
    this.FormularioNuevaDireccion.controls['txtTelefonofijo'].enable();
    this.FormularioNuevaDireccion.controls['txtAnexo'].enable();
    this.FormularioNuevaDireccion.controls['txtCelular'].enable();
    this.FormularioNuevaDireccion.controls['cboDepartamento'].enable();
    this.FormularioNuevaDireccion.controls['cboProvincia'].enable();
    this.FormularioNuevaDireccion.controls['cboDistrito'].enable();
    this.FormularioNuevaDireccion.controls['cboTipoDireccion'].enable();

    this.FormularioNuevaDireccion.get("txtAccion")?.setValue("edit");
    this.statusBtnNueva = true;
    this.statusBtnGuardar = false;
    this.statusBtnCancelar = false;

    this.FormularioNuevaDireccion.get('txtDireccion')?.setValue(row.descripcion);
    this.FormularioNuevaDireccion.get('txtNumero')?.setValue(row.nro_mz_lote);
    this.FormularioNuevaDireccion.get('txtInterior')?.setValue(row.dpto_interior);
    this.FormularioNuevaDireccion.get('txtUrbanizacion')?.setValue(row.urbanizacion);
    this.FormularioNuevaDireccion.get('txtReferencia')?.setValue(row.referencia);
    this.FormularioNuevaDireccion.get('txtTelefonofijo')?.setValue(row.telefono_fijo);
    this.FormularioNuevaDireccion.get('txtAnexo')?.setValue(row.anexo);
    this.FormularioNuevaDireccion.get('txtCelular')?.setValue(row.celular);
    this.valDepartamento = row.cod_departamento;
    this.codDireccion = row.id_direccion;
    this.codUbigeo = row.id_ubigeo;

    if (this.valDepartamento) {
      this.getProvinciaList(this.valDepartamento);
      this.valProvincia = row.cod_provincia;
    }
    if (this.valProvincia) {
      this.getDistritoList(this.valDepartamento, this.valProvincia);
      this.valDistrito = row.cod_distrito;
    }
    this.valTipoDireccion = row.id_tipo_direccion;
  }

  newDireccion() {
    this.FormularioNuevaDireccion.controls['txtDireccion'].enable();
    this.FormularioNuevaDireccion.controls['txtNumero'].enable();
    this.FormularioNuevaDireccion.controls['txtInterior'].enable();
    this.FormularioNuevaDireccion.controls['txtUrbanizacion'].enable();
    this.FormularioNuevaDireccion.controls['txtReferencia'].enable();
    this.FormularioNuevaDireccion.controls['txtTelefonofijo'].enable();
    this.FormularioNuevaDireccion.controls['txtAnexo'].enable();
    this.FormularioNuevaDireccion.controls['txtCelular'].enable();
    this.FormularioNuevaDireccion.controls['cboDepartamento'].enable();
    this.FormularioNuevaDireccion.controls['cboProvincia'].enable();
    this.FormularioNuevaDireccion.controls['cboDistrito'].enable();
    this.FormularioNuevaDireccion.controls['cboTipoDireccion'].enable();
    this.FormularioNuevaDireccion.get("txtAccion")?.setValue("new");
    this.statusBtnNueva = true;
    this.statusBtnGuardar = false;
    this.statusBtnCancelar = false;
  }

  cancelDireccion() {
    this.FormularioNuevaDireccion.controls['txtDireccion'].disable();
    this.FormularioNuevaDireccion.controls['txtNumero'].disable();
    this.FormularioNuevaDireccion.controls['txtInterior'].disable();
    this.FormularioNuevaDireccion.controls['txtUrbanizacion'].disable();
    this.FormularioNuevaDireccion.controls['txtReferencia'].disable();
    this.FormularioNuevaDireccion.controls['txtTelefonofijo'].disable();
    this.FormularioNuevaDireccion.controls['txtAnexo'].disable();
    this.FormularioNuevaDireccion.controls['txtCelular'].disable();
    this.FormularioNuevaDireccion.controls['cboDepartamento'].disable();
    this.FormularioNuevaDireccion.controls['cboProvincia'].disable();
    this.FormularioNuevaDireccion.controls['cboDistrito'].disable();
    this.FormularioNuevaDireccion.controls['cboTipoDireccion'].disable();

    this.FormularioNuevaDireccion.reset();
    this.statusBtnNueva = false;
    this.statusBtnGuardar = true;
    this.statusBtnCancelar = true;
  }

  saveDireccion() {
    if (this.FormularioNuevaDireccion.valid) {
      this.direccion.id_persona = this.codPaciente;
      this.direccion.id_ubigeo = this.codUbigeo;
      this.direccion.id_tipo_direccion = parseInt(this.FormularioNuevaDireccion.value["cboTipoDireccion"]?.toString() || '') || 0;
      this.direccion.descripcion = this.FormularioNuevaDireccion.value["txtDireccion"]?.toString() || '';
      this.direccion.anexo = this.FormularioNuevaDireccion.value["txtAnexo"]?.toString() || '';
      this.direccion.celular = this.FormularioNuevaDireccion.value["txtCelular"]?.toString() || '';
      this.direccion.telefono_fijo = this.FormularioNuevaDireccion.value["txtTelefonofijo"]?.toString() || '';
      this.direccion.nro_mz_lote = this.FormularioNuevaDireccion.value["txtNumero"]?.toString() || '';
      this.direccion.urbanizacion = this.FormularioNuevaDireccion.value["txtUrbanizacion"]?.toString() || '';
      this.direccion.referencia = this.FormularioNuevaDireccion.value["txtReferencia"]?.toString() || '';
      this.direccion.dpto_interior = this.FormularioNuevaDireccion.value["txtInterior"]?.toString() || '';
      //console.log(this.direccion);

      if (this.FormularioNuevaDireccion.value["txtAccion"] == "new") {
        this.direccion.usuario_creacion = this.usuarioEnlinea.id || '';
        this._direccionService.addDireccion(this.direccion).subscribe({
          next: (val: any) => {
            this.toastrService.success('La direccion se registró correctamente!');
            this.getDireccionList();
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this.direccion.id_direccion = this.codDireccion;
        this.direccion.usuario_modificacion = this.usuarioEnlinea.id || '';
        this._direccionService.updateDireccion(this.direccion).subscribe({
          next: (val: any) => {
            this.toastrService.success('La direccion se actualizó correctamente!');
            this.getDireccionList();
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
    else {
      this.validateAllFormFields(this.FormularioNuevaDireccion);
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  seleccionarDireccion(row: Direccion) {
    this._dialogRef.close({
      data: row
    });
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

  soloLetras(event: Event): boolean {
    return soloLetras(event);
  }

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

  limpiarLetras(event: Event): boolean {
    return limpiarLetras(event);
  }

  primer9(event: Event): boolean {
    return primer9(event);
  }
}