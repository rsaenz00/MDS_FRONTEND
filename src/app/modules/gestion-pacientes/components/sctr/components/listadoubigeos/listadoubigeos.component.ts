import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { Ubigeos } from 'src/app/models/ubigeo.model';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-listadoubigeos',
  templateUrl: './listadoubigeos.component.html',
  styleUrl: './listadoubigeos.component.scss'
})

export class ListadoubigeosComponent implements OnInit {
  displayedColumns: string[] = ['distrito', 'provincia', 'departamento'];
  dataSource!: MatTableDataSource<Ubigeos>;
  countRows: number = 0;

  public txtDistrito = '';
  public txtProvincia = '';
  public txtDepartamento = '';
  filterDictionary = new Map<string, string>();

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

  getFilterPredicate(record: string, filter: string) {
    this.dataSource.filterPredicate = function (record, filter) {
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      let val: any;
      for (let [key, value] of map) {
        val = value;
        isMatch = (value == "") || (record[key as keyof Ubigeos].includes(val) === true);
        if (!isMatch) return false;
      }
      return isMatch;

    }
  }

  getUbigeosList() {
    this._ubigeosService.getUbigeosList().subscribe({
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

  filtrarDistrito(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.txtDistrito = ds === null ? '' : ds;
    this.getFilterPredicate('distrito', this.txtDistrito);

    const filterValue = this.txtDistrito;
    this.filterDictionary.set('distrito', filterValue);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    
    this.dataSource.filter = jsonString;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtrarProvincia(event: Event) {
    const pr = (event.target as HTMLInputElement).value;
    this.txtProvincia = pr === null ? '' : pr;
    this.getFilterPredicate('provincia', this.txtProvincia);

    const filterValue = this.txtProvincia;
    this.filterDictionary.set('provincia', filterValue);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    
    this.dataSource.filter = jsonString;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filtrarDepartamento(event: Event) {
    const dp = (event.target as HTMLInputElement).value;
    this.txtDepartamento = dp === null ? '' : dp;
    this.getFilterPredicate('departamento', this.txtDepartamento);

    const filterValue = this.txtDepartamento;
    this.filterDictionary.set('departamento', filterValue);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));

    this.dataSource.filter = jsonString;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filaSeleccionada(row: Ubigeos) {
    this.dialogRef.close({
      data: row
    });
  }

}