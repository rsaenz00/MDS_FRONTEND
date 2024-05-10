import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Blog } from 'src/app/models/blog.model';
import { SctrTiposervicioComponent } from './components/tiposervicio/sctr-tiposervicio.component';
import { SctrVerdatosComponent } from './components/verdatos/sctr-verdatos.component';
import { SctrSeguimientoComponent } from './components/seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from './components/soporte/sctr-soporte.component';
import { AtencionService } from 'src/app/services/atencion.service';
import { Atencion } from 'src/app/models/atencion.model';

@Component({
  selector: 'app-sctr',
  templateUrl: './sctr.component.html',
  styleUrl: './sctr.component.scss'
})

export class SctrComponent implements OnInit {
  displayedColumns: string[] = ['cod_atencion', 'tipo_atencion', 'estado', 'fecha_creacion', 'hora_creacion', 'documento_identidad', 'numero', 'paciente', 'fecha_nacimiento', 'clinica', 'empresa', 'empresa_ruc', 'plan', 'motivo', 'usuario_creacion', 'skill', 'accion'];
  dataSource!: MatTableDataSource<Atencion>;
  footerToDisplayed: string[] = ["footer"];
  countRows: number = 0;

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _atencionService: AtencionService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale("es-pe");
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAtencionesList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getAtencionesList() {
    this._atencionService.GetAtencionesList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  openSoporteDialog() {
    this._dialog.open(SctrSoporteComponent, {
      panelClass: 'sanna_theme'
    });
  }

  openSeguimientoDialog() {
    this._dialog.open(SctrSeguimientoComponent, {
      panelClass: 'sanna_theme'
    });
  }

  openVerDatosDialog() {
    this._dialog.open(SctrVerdatosComponent, {
      panelClass: 'sanna_theme'
    });
  }

  openTipoServicioDialog() {
    const dialogRef = this._dialog.open(SctrTiposervicioComponent, {
      panelClass: 'sanna_theme',
      disableClose: true,
      width: '430px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAtencionesList();
    });
  }

}