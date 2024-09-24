import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ListadoubigeosComponent } from '../sctr-listado-ubigeos/listado-ubigeos.component';
import { ClinicaService } from 'src/app/services/clinica.service';
import { MatPaginator } from '@angular/material/paginator';
import { Clinica, ClinicasFiltro } from 'src/app/models/clinica.model';
import { ToastrService } from 'ngx-toastr';
import { limpiarNumero, soloNumeros } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-sctr-mantenimiento-clinica',
  templateUrl: './sctr-mantenimiento-clinica.component.html',
  styleUrl: './sctr-mantenimiento-clinica.component.scss'
})

export class SctrMantenimientoclinicaComponent implements OnInit {
  displayedColumns: string[] = ['id_clinica', 'clinica'];
  dataSource!: MatTableDataSource<ClinicasFiltro>;
  codUbigeo: string;
  codClinica: number;
  countRows: number = 0;

  public txtClinica = '';

  constructor(private _dialog: MatDialog, private frm: FormBuilder, private _liveAnnouncer: LiveAnnouncer, private _clinicasServices: ClinicaService, public _dialogRef: MatDialogRef<SctrMantenimientoclinicaComponent>, private toastrService: ToastrService) { }

  formularioClinica = this.frm.group({
    txtCodIpress: [{ value: '', disabled: true }],
    txtClinica: [{ value: '', disabled: false }, Validators.required],
    txtDireccion: [{ value: '', disabled: true }, Validators.required],
    txtTelefono: [{ value: '', disabled: true }, Validators.required],
    //txtAnexo: [{ value: '', disabled: true }],
    cboEstado: [{ value: '', disabled: true }, Validators.required],
    cboValidacion: [{ value: '', disabled: true }, Validators.required],
    txtUbigeo: [{ value: '', disabled: true }, Validators.required],
    txtAccion: [{ value: '', disabled: false }, Validators.required]
  });

  clinica: Clinica = {} as Clinica;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  statusBtnBuscarUbigeo = true;
  statusBtnNuevaClinica = false;
  statusBtnGuardarClinica = true;
  statusBtnCancelarClinica = true;
  codEstado = -1;
  codValidacion = -1;

  ngOnInit(): void {
    this.getClinicasList();
  }

  getClinicasList() {
    this._clinicasServices.GetClinicasList().subscribe({
      next: (res) => {
        //console.log(res.resultData)
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  getClinicasFilterList(busqueda: string, condicion: string) {
    this._clinicasServices.GetClinicasFiltro(busqueda, condicion).subscribe({
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
        this.formularioClinica.controls['txtUbigeo'].setValue(result.data.departamento + " - " + result.data.provincia + " - " + result.data.distrito);
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
        this.getClinicasFilterList(this.txtClinica, 'Clinica');
      }
    }
  }

  newClinica() {
    this.formularioClinica.get("txtAccion")?.setValue("new");
    this.formularioClinica.controls['cboEstado'].enable();
    this.formularioClinica.controls['cboValidacion'].enable();
    //this.formularioClinica.controls['txtCodIpress'].enable();
    this.formularioClinica.controls['txtClinica'].enable();
    this.formularioClinica.controls['txtDireccion'].enable();
    this.formularioClinica.controls['txtTelefono'].enable();
    //this.formularioClinica.controls['txtAnexo'].enable();
    //this.formularioClinica.controls['txtUbigeo'].enable();
    this.statusBtnNuevaClinica = true;
    this.statusBtnBuscarUbigeo = false;
    this.statusBtnGuardarClinica = false;
    this.statusBtnCancelarClinica = false;
  }

  cancelClinica() {
    this.formularioClinica.reset();
    this.formularioClinica.controls['cboEstado'].disable();
    this.formularioClinica.controls['cboValidacion'].disable();
    //this.formularioClinica.controls['txtCodIpress'].disable();
    //this.formularioClinica.controls['txtClinica'].disable();
    this.formularioClinica.controls['txtDireccion'].disable();
    this.formularioClinica.controls['txtTelefono'].disable();
    //this.formularioClinica.controls['txtAnexo'].disable();
    //this.formularioClinica.controls['txtUbigeo'].disable();
    this.statusBtnNuevaClinica = false;
    this.statusBtnBuscarUbigeo = true;
    this.statusBtnGuardarClinica = true;
    this.statusBtnCancelarClinica = true;
  }

  exitClinica() {
    this.formularioClinica.reset();
    this._dialogRef.close(true);
  }

  selectRow(row: Clinica) {
    //console.log(row)
    this.formularioClinica.get("txtAccion")?.setValue("edit");
    this.formularioClinica.controls['cboEstado'].enable();
    this.formularioClinica.controls['cboValidacion'].enable();
    //this.formularioClinica.controls['txtCodIpress'].enable();
    this.formularioClinica.controls['txtClinica'].enable();
    this.formularioClinica.controls['txtDireccion'].enable();
    this.formularioClinica.controls['txtTelefono'].enable();
    //this.formularioClinica.controls['txtAnexo'].enable();
    //this.formularioClinica.controls['txtUbigeo'].enable();
    this.statusBtnNuevaClinica = true;
    this.statusBtnBuscarUbigeo = false;
    this.statusBtnGuardarClinica = false;
    this.statusBtnCancelarClinica = false;

    this.formularioClinica.get("txtUbigeo")?.setValue(row.departamento + " - " + row.provincia + " - " + row.distrito);
    this.codUbigeo = row.ubigeo;
    this.codClinica = parseInt(row.id_clinica);
    this.formularioClinica.get("txtCodIpress")?.setValue(row.id_clinica);
    this.formularioClinica.get("txtClinica")?.setValue(row.clinica);
    this.formularioClinica.get("txtDireccion")?.setValue(row.direccion);
    this.formularioClinica.get("txtTelefono")?.setValue(row.telefono);
    //this.formularioClinica.get("txtAnexo")?.setValue(row.anexo);

    if (row.afiliado == "1") {
      this.codValidacion = 1;
    } else {
      this.codValidacion = 0;
    }
    if (row.estado == 1) {
      this.codEstado = 1;
    } else {
      this.codEstado = 0;
    }

    this.formularioClinica.get("cboValidacion")?.setValue(this.codValidacion.toString());
    this.formularioClinica.get("cboEstado")?.setValue(this.codEstado.toString());

  }

  saveClinica() {
    if (this.formularioClinica.valid) {
      this.clinica.clinica = this.formularioClinica.value["txtClinica"] || '';
      this.clinica.ubigeo = this.codUbigeo.toString();
      this.clinica.direccion = this.formularioClinica.value["txtDireccion"] || '';
      this.clinica.telefono = this.formularioClinica.value["txtTelefono"] || '';
      //this.clinica.anexo = this.formularioClinica.value["txtAnexo"] || '';
      if (this.formularioClinica.value["cboValidacion"] == "1") {
        this.clinica.afiliado = "1";
      } else {
        this.clinica.afiliado = "0";
      }
      if (this.formularioClinica.value["cboEstado"] == "1") {
        this.clinica.estado = 1;
      } else {
        this.clinica.estado = 0;
      }

      if (this.formularioClinica.value["txtAccion"] == "new") {
        this._clinicasServices.addClinica(this.clinica).subscribe({
          next: (val: any) => {
            this.getClinicasList();
            this.toastrService.success('¡Clínica creada satisfactoriamente!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this.clinica.id_clinica = this.codClinica.toString();
        this._clinicasServices.updateClinica(this.clinica).subscribe({
          next: (val: any) => {
            this.getClinicasList();
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

  soloNumeros(event: Event): boolean {
    return soloNumeros(event);
  }

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

}