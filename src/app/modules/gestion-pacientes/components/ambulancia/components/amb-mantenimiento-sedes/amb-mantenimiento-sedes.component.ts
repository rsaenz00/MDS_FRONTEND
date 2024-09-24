import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ListadoubigeosComponent } from '../../../sctr/components/sctr-listado-ubigeos/listado-ubigeos.component';
import { SedeTraslado, SedeTrasladoFiltro } from 'src/app/models/sedetraslado.model';
import { SedeTrasladoService } from 'src/app/services/sedetraslado.service';
import { UsuarioAuth } from 'src/app/models/usuario-auth';

@Component({
  selector: 'app-amb-mantenimiento-sedes',
  templateUrl: './amb-mantenimiento-sedes.component.html',
  styleUrl: './amb-mantenimiento-sedes.component.scss'
})

export class AmbMantenimientoSedesComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'direccion', 'referencia'];
  dataSource!: MatTableDataSource<SedeTrasladoFiltro>;
  codUbigeo: string;
  codSede: string;
  countRows: number = 0;

  public txtClinica = '';

  constructor(private _dialog: MatDialog, private frm: FormBuilder, private _liveAnnouncer: LiveAnnouncer, private _sedeTrasladoServices: SedeTrasladoService, public _dialogRef: MatDialogRef<AmbMantenimientoSedesComponent>, private toastrService: ToastrService) { }

  formularioSede = this.frm.group({
    txtClinica: [{ value: '', disabled: false }, Validators.required],
    txtDireccion: [{ value: '', disabled: true }, Validators.required],
    txtReferencia: [{ value: '', disabled: true }, Validators.required],
    txtUbigeo: [{ value: '', disabled: true }, Validators.required],
    txtAccion: [{ value: '', disabled: false }, Validators.required]
  });

  sedeTraslado: SedeTraslado = {} as SedeTraslado;
  usuarioEnlinea: UsuarioAuth;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  statusBtnBuscarUbigeo = true;
  statusBtnNuevaClinica = false;
  statusBtnGuardarClinica = true;
  statusBtnCancelarClinica = true;
  codEstado = -1;
  codValidacion = -1;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
  }

  getClinicasFilterList(busqueda: string, condicion: string) {
    this._sedeTrasladoServices.GetSedesTrasladoFiltro(busqueda, condicion).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openUbigeoDialog() {
    const dialogRef = this._dialog.open(ListadoubigeosComponent, {
      disableClose: true,
      panelClass: 'sanna_theme',
      width: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        this.codUbigeo = result.data.codigo;
        this.formularioSede.controls['txtUbigeo'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
      } else {
        this.toastrService.warning('¡Por favor seleccione un Ubigeo!');
      }
    });
  }

  filtrarClinica(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.txtClinica = ds === null ? '' : ds;
    if (this.txtClinica == '') {
      this.getClinicasFilterList('', '');
    } else {
      if (ds.length >= 3) {
        this.getClinicasFilterList(this.txtClinica, 'Sede');
      }
    }
  }

  newClinica() {
    this.formularioSede.get("txtAccion")?.setValue("new");
    this.formularioSede.controls['txtClinica'].enable();
    this.formularioSede.controls['txtDireccion'].enable();
    this.formularioSede.controls['txtReferencia'].enable();
    this.statusBtnNuevaClinica = true;
    this.statusBtnBuscarUbigeo = false;
    this.statusBtnGuardarClinica = false;
    this.statusBtnCancelarClinica = false;
  }

  cancelClinica() {
    this.formularioSede.reset();
    this.formularioSede.controls['txtDireccion'].disable();
    this.formularioSede.controls['txtReferencia'].disable();
    this.statusBtnNuevaClinica = false;
    this.statusBtnBuscarUbigeo = true;
    this.statusBtnGuardarClinica = true;
    this.statusBtnCancelarClinica = true;
  }

  exitClinica() {
    this.formularioSede.reset();
    this._dialogRef.close(true);
  }

  selectRow(row: SedeTraslado) {
    this.formularioSede.get("txtAccion")?.setValue("edit");
    this.formularioSede.controls['txtClinica'].enable();
    this.formularioSede.controls['txtDireccion'].enable();
    this.formularioSede.controls['txtReferencia'].enable();
    this.statusBtnNuevaClinica = true;
    this.statusBtnBuscarUbigeo = false;
    this.statusBtnGuardarClinica = false;
    this.statusBtnCancelarClinica = false;

    this.formularioSede.get("txtUbigeo")?.setValue(row.departamento + " - " + row.provincia + " - " + row.distrito);
    this.codUbigeo = row.ubigeo;
    this.codSede = row.id;
    this.formularioSede.get("txtClinica")?.setValue(row.nombre);
    this.formularioSede.get("txtDireccion")?.setValue(row.direccion);
    this.formularioSede.get("txtReferencia")?.setValue(row.referencia);
  }

  saveClinica() {
    if (this.formularioSede.valid) {
      this.sedeTraslado.nombre = this.formularioSede.value["txtClinica"] || '';
      this.sedeTraslado.cod_ubigeo = this.codUbigeo.toString();
      this.sedeTraslado.direccion = this.formularioSede.value["txtDireccion"] || '';
      this.sedeTraslado.referencia = this.formularioSede.value["txtReferencia"] || '';
      this.sedeTraslado.usuario_creacion = this.usuarioEnlinea.id || '';

      if (this.formularioSede.value["txtAccion"] == "new") {
        this._sedeTrasladoServices.addSedeTraslado(this.sedeTraslado).subscribe({
          next: (val: any) => {
            this.toastrService.success('¡Clínica creada satisfactoriamente!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this.sedeTraslado.id = this.codSede;
        this.sedeTraslado.usuario_modificacion = this.usuarioEnlinea.id || '';
        this._sedeTrasladoServices.updateSedeTraslado(this.sedeTraslado).subscribe({
          next: (val: any) => {
            this.toastrService.success('¡Clínica actualizada satisfactoriamente!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }

    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

}