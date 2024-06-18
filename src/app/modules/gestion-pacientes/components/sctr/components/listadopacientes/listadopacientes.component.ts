import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { PacientesFiltro } from 'src/app/models/paciente.model';
import { PacienteService } from 'src/app/services/paciente.service';

@Component({
  selector: 'app-listadopacientes',
  templateUrl: './listadopacientes.component.html',
  styleUrl: './listadopacientes.component.scss'
})

export class ListadopacientesComponent implements OnInit {
  displayedColumns: string[] = ['tipo_documento', 'numero_documento', 'nombres', 'apellido_paterno', 'apellido_materno'];
  dataSource!: MatTableDataSource<PacientesFiltro>;
  countRows: number = 0;

  public txtApePaternoDNI = '';
  public txtApeMaterno = '';
  public txtNombres = '';

  constructor(private _liveAnnouncer: LiveAnnouncer, private _pacientesServices: PacienteService, private frm: FormBuilder,
    public dialogRef: MatDialogRef<ListadopacientesComponent>) { }

  formularioClinicas = this.frm.group({
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
    this._pacientesServices.GetPacientesFiltro(busqueda, condicion).subscribe({
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

  filtrarApePaternoDni(event: Event) {
    this.formularioClinicas.controls['txtApeMaterno'].reset();
    this.formularioClinicas.controls['txtNombres'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtApePaternoDNI = ds === null ? '' : ds;

    if (this.txtApePaternoDNI == '') {
      //this.getPacientesList('', '');
    } else {
      this.getPacientesList(this.txtApePaternoDNI, 'ApePaternoDni');
    }
  }

  filtrarApeMaternoDni(event: Event) {
    this.formularioClinicas.controls['txtNombres'].reset();
    this.formularioClinicas.controls['txtApePaternoDNI'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtApeMaterno = ds === null ? '' : ds;

    if (this.txtApeMaterno == '') {
      //this.getPacientesList('', '');
    } else {
      this.getPacientesList(this.txtApeMaterno, 'ApeMaterno');
    }
  }

  filtrarNombres(event: Event) {
    this.formularioClinicas.controls['txtApePaternoDNI'].reset();
    this.formularioClinicas.controls['txtApePaternoDNI'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtNombres = ds === null ? '' : ds;

    if (this.txtNombres == '') {
      //this.getPacientesList('', '');
    } else {
      this.getPacientesList(this.txtNombres, 'Nombres');
    }
  }

  filaSeleccionada(row: PacientesFiltro) {
    this.dialogRef.close({
      data: row
    });
  }

}