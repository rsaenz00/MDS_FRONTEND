import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { Ubigeos } from 'src/app/models/ubigeo.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-listadoubigeos',
  templateUrl: './listadoubigeos.component.html',
  styleUrl: './listadoubigeos.component.scss',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatCardModule, MatRadioModule, MatCheckboxModule, MatDialogModule, MatButtonModule, ReactiveFormsModule]
})

export class ListadoubigeosComponent implements OnInit {
  displayedColumns: string[] = ['distrito', 'provincia', 'departamento'];
  dataSource!: MatTableDataSource<Ubigeos>;

  public txtDistrito = '';
  public txtProvincia = '';
  public txtDepartamento = '';

  constructor(private _liveAnnouncer: LiveAnnouncer, private _ubigeosService: UbigeoService, private frm: FormBuilder,
    public dialogRef: MatDialogRef<ListadoubigeosComponent>) { }

  formularioUbigeo = this.frm.group({
    txtDistrito: [''],
    txtProvincia: [''],
    txtDepartamento: ['']
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getUbigeosList();
  }

  
  getFilterPredicate(tipo: string) {
    return (row: Ubigeos, filters: string) => {
      const txtDistrito = filters;
      const txtProvincia = filters;
      const txtDepartamento = filters;

      const columnDistrito = row.distrito;
      const columnProvincia = row.provincia;
      const columnDepartamento = row.departamento;

      var customFilter = false;

      if (tipo == 'distrito') {
        customFilter = columnDistrito.toLowerCase().includes(txtDistrito);
      } else if (tipo == 'provincia') {
        customFilter = columnProvincia.toLowerCase().includes(txtProvincia);
      } else if (tipo == 'departamento') {
        customFilter = columnDepartamento.toLowerCase().includes(txtDepartamento);
      }

      const matchFilter: any[] = [];

      matchFilter.push(customFilter);

      return matchFilter.every(Boolean);
    };
  }

  getUbigeosList() {
    this._ubigeosService.getUbigeosList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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

  filtrarDistrito(event: Event) {
    this.formularioUbigeo.controls['txtDepartamento'].reset();
    this.formularioUbigeo.controls['txtProvincia'].reset();

    this.dataSource.filterPredicate = this.getFilterPredicate('distrito');

    const ds = (event.target as HTMLInputElement).value;
    this.txtDistrito = ds === null ? '' : ds;

    const filterValue = this.txtDistrito;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtrarProvincia(event: Event) {
    this.formularioUbigeo.controls['txtDepartamento'].reset();
    this.formularioUbigeo.controls['txtDistrito'].reset();

    this.dataSource.filterPredicate = this.getFilterPredicate('provincia');
    const pr = (event.target as HTMLInputElement).value;
    this.txtProvincia = pr === null ? '' : pr;

    const filterValue = this.txtProvincia;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtrarDepartamento(event: Event) {
    this.formularioUbigeo.controls['txtProvincia'].reset();
    this.formularioUbigeo.controls['txtDistrito'].reset();

    this.dataSource.filterPredicate = this.getFilterPredicate('departamento');
    const dp = (event.target as HTMLInputElement).value;
    this.txtDepartamento = dp === null ? '' : dp;

    const filterValue = this.txtDepartamento;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filaSeleccionada(row: Ubigeos) {
    this.dialogRef.close({ data: row });
  }

}