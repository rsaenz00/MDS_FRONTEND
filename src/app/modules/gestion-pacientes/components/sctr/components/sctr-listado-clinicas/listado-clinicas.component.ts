import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ClinicaService } from 'src/app/services/clinica.service';
import { ClinicasFiltro } from 'src/app/models/clinica.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listado-clinicas',
  templateUrl: './listado-clinicas.component.html',
  styleUrl: './listado-clinicas.component.scss'
})

export class ListadoclinicasComponent implements OnInit {
  displayedColumns: string[] = ['clinica', 'direccion', 'telefono', 'distrito', 'provincia', 'departamento'];
  dataSource!: MatTableDataSource<ClinicasFiltro>;
  countRows: number = 0;

  public txtTodos = '';
  public txtClinica = '';
  public txtDireccion = '';
  public txtTelefono = '';
  public txtDistrito = '';
  public txtProvincia = '';
  public txtDepartamento = '';

  constructor(private _liveAnnouncer: LiveAnnouncer, private _clinicasServices: ClinicaService, private frm: FormBuilder,
    public dialogRef: MatDialogRef<ListadoclinicasComponent>) { }

  formularioClinicas = this.frm.group({
    txtTodos: [''],
    txtClinica: [''],
    txtDireccion: [''],
    txtTelefono: [''],
    txtDistrito: [''],
    txtProvincia: [''],
    txtDepartamento: ['']
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getClinicasList('', '');
  }

  getFilterPredicate(tipo: string) {
    return (row: ClinicasFiltro, filters: string) => {

      const txtTodos = filters;
      const txtClinica = filters;
      const txtDireccion = filters;
      const txtTelefono = filters;
      const txtDistrito = filters;
      const txtProvincia = filters;
      const txtDepartamento = filters;

      const columnIpress = row.clinica;
      const columnDireccion = row.direccion;
      const columnTelefono = row.telefono;
      const columnDistrito = row.distrito;
      const columnProvincia = row.provincia;
      const columnDepartamento = row.departamento;

      var customFilter = false;

      if (tipo == 'clinica') {
        customFilter = columnIpress.toLowerCase().includes(txtClinica);
      } else if (tipo == 'direccion') {
        customFilter = columnDireccion.toLowerCase().includes(txtDireccion);
      } else if (tipo == 'telefono') {
        customFilter = columnTelefono.toLowerCase().includes(txtTelefono);
      } else if (tipo == 'distrito') {
        customFilter = columnDistrito.toLowerCase().includes(txtDistrito);
      } else if (tipo == 'provincia') {
        customFilter = columnProvincia.toLowerCase().includes(txtProvincia);
      } else if (tipo == 'departamento') {
        customFilter = columnDepartamento.toLowerCase().includes(txtDepartamento);
      } else if (tipo == 'todos') {
        customFilter = columnIpress.toLowerCase().includes(txtTodos) || columnDireccion.toLowerCase().includes(txtTodos) || columnTelefono.toLowerCase().includes(txtTodos) || columnDistrito.toLowerCase().includes(txtTodos) || columnProvincia.toLowerCase().includes(txtTodos) || columnDepartamento.toLowerCase().includes(txtTodos);
      }

      const matchFilter: any[] = [];
      matchFilter.push(customFilter);

      return matchFilter.every(Boolean);
    };
  }

  getClinicasList(busqueda: string, condicion: string) {
    this._clinicasServices.GetClinicasFiltro(busqueda, condicion).subscribe({
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrarTodos(event: Event) {
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtTodos = ds === null ? '' : ds;

    if (this.txtTodos == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtTodos, 'Todos');
    }
  }

  filtrarClinica(event: Event) {
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtClinica = ds === null ? '' : ds;

    if (this.txtClinica == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtClinica, 'Clinica');
    }
  }

  filtrarDireccion(event: Event) {
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtDireccion = ds === null ? '' : ds;

    if (this.txtDireccion == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtDireccion, 'Direccion');
    }
  }

  filtrarTelefono(event: Event) {
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtTelefono = ds === null ? '' : ds;

    if (this.txtTelefono == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtTelefono, 'Telefono');
    }
  }

  filtrarDistrito(event: Event) {
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtDistrito = ds === null ? '' : ds;

    if (this.txtDistrito == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtDistrito, 'Distrito');
    }
  }

  filtrarProvincia(event: Event) {
    this.formularioClinicas.controls['txtDepartamento'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtProvincia = ds === null ? '' : ds;

    if (this.txtProvincia == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtProvincia, 'Provincia');
    }
  }

  filtrarDepartamento(event: Event) {
    this.formularioClinicas.controls['txtProvincia'].reset();
    this.formularioClinicas.controls['txtDistrito'].reset();
    this.formularioClinicas.controls['txtClinica'].reset();
    this.formularioClinicas.controls['txtDireccion'].reset();
    this.formularioClinicas.controls['txtTelefono'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtDepartamento = ds === null ? '' : ds;

    if (this.txtDepartamento == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtDepartamento, 'Departamento');
    }
  }

  filaSeleccionada(row: ClinicasFiltro) {
    this.dialogRef.close({
      data: row
    });
  }

}