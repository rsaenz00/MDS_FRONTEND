import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { PacientesFiltro } from 'src/app/models/paciente.model';
import { PacienteService } from 'src/app/services/paciente.service';
import { limpiarLetras, limpiarNumero, rellenaCaracteres, soloLetras, soloNumeros } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-listado-pacientes',
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.scss'
})

export class ListadopacientesComponent implements OnInit {
  displayedColumns: string[] = ['tipo_documento', 'numero_documento', 'nombres', 'apellido_paterno', 'apellido_materno'];
  dataSource!: MatTableDataSource<PacientesFiltro>;
  countRows: number = 0;
  NombreServicio: string;
  msgBusqueda: string = 'Por favor complete los datos para realizar una búsqueda';
  showSpinner = false;
  statusBtnFiltrar = true;

  public txtApePaternoDNI = '';
  public txtApeMaterno = '';
  public txtNombres = '';

  constructor(private _liveAnnouncer: LiveAnnouncer, private _pacientesServices: PacienteService, private frm: FormBuilder,
    public dialogRef: MatDialogRef<ListadopacientesComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.NombreServicio = data.servicio;
  }

  formularioBusquedaPaciente = this.frm.group({
    txtApePaternoDNI: [''],
    txtApeMaterno: [''],
    txtNombres: ['']
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    //this.getPacientesList('', '');
  }

  /*getFilterPredicate(tipo: string) {
    return (row: PacientesFiltro, filters: string) => {

      const txtApePaternoDNI = filters;
      const txtApeMaterno = filters;
      const txtNombres = filters;

      const columnApePaterno = row.apellido_paterno;
      const columnDni = row.dni;
      const columnApeMaterno = row.apellido_materno;
      const columnNombres = row.nombres;

      var customFilter = false;

      if (tipo == 'nombres') {
        customFilter = columnNombres.toLowerCase().includes(txtApeMaterno);
      } else if (tipo == 'ape_materno') {
        customFilter = columnApeMaterno.toLowerCase().includes(txtNombres);
      } else if (tipo == 'ape_paterno_dni') {
        customFilter = columnApePaterno.toLowerCase().includes(txtApePaternoDNI) || columnDni.toLowerCase().includes(txtApePaternoDNI);
      }

      const matchFilter: any[] = [];
      matchFilter.push(customFilter);

      return matchFilter.every(Boolean);
    };
  }*/

  getPacientesList(busqueda: string, condicion: string) {
    this.msgBusqueda = 'Buscando datos... ¡Espere por favor!';
    this.showSpinner = true;
    this.statusBtnFiltrar = true;
    this._pacientesServices.GetPacientesFiltro(busqueda, condicion).subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.statusBtnFiltrar = false;
        //console.log(res.resultData)
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
        if (this.countRows == 0) {
          this.msgBusqueda = 'No existe información de búsqueda, intente consultar con otros datos';
        } else {
          this.msgBusqueda = '';
        }
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

  filtrar() {
    if (this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].value) {
      this.formularioBusquedaPaciente.controls['txtApeMaterno'].reset();
      this.formularioBusquedaPaciente.controls['txtNombres'].reset();
      this.getPacientesList(this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].value, 'ApePaternoDni');
    } else if (this.formularioBusquedaPaciente.controls['txtApeMaterno'].value) {
      this.formularioBusquedaPaciente.controls['txtNombres'].reset();
      this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].reset();
      this.getPacientesList(this.formularioBusquedaPaciente.controls['txtApeMaterno'].value, 'ApeMaterno');
    } else if (this.formularioBusquedaPaciente.controls['txtNombres'].value) {
      this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].reset();
      this.formularioBusquedaPaciente.controls['txtApeMaterno'].reset();
      this.getPacientesList(this.formularioBusquedaPaciente.controls['txtNombres'].value, 'Nombres');
    }
  }

  filtrarApePaternoDni(event: Event) {
    this.formularioBusquedaPaciente.controls['txtApeMaterno'].reset();
    this.formularioBusquedaPaciente.controls['txtNombres'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtApePaternoDNI = ds === null ? '' : ds;

    if (this.txtApePaternoDNI == '') {
      this.statusBtnFiltrar = true;
      //this.getPacientesList('', '');
    } else {
      this.statusBtnFiltrar = false;
      //this.getPacientesList(this.txtApePaternoDNI, 'ApePaternoDni');
    }
  }

  filtrarApeMaterno(event: Event) {
    this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].reset();
    this.formularioBusquedaPaciente.controls['txtNombres'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtApeMaterno = ds === null ? '' : ds;

    if (this.txtApeMaterno == '') {
      this.statusBtnFiltrar = true;
      //this.getPacientesList('', '');
    } else {
      this.statusBtnFiltrar = false;
      //this.getPacientesList(this.txtApeMaterno, 'ApeMaterno');
    }
  }

  filtrarNombres(event: Event) {
    this.formularioBusquedaPaciente.controls['txtApePaternoDNI'].reset();
    this.formularioBusquedaPaciente.controls['txtApeMaterno'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtNombres = ds === null ? '' : ds;

    if (this.txtNombres == '') {
      this.statusBtnFiltrar = true;
      //this.getPacientesList('', '');
    } else {
      this.statusBtnFiltrar = false;
      //this.getPacientesList(this.txtNombres, 'Nombres');
    }
  }

  filaSeleccionada(row: PacientesFiltro) {
    this.dialogRef.close({
      data: row,
      'servicio': this.NombreServicio
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

  rellenaCaracteres(event: Event): boolean {
    return rellenaCaracteres(event);
  }

}