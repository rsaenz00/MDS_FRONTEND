import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
//import { MantblogComponent } from 'src/app/views/layout/mantblog/mantblog.component';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { Blog } from 'src/app/models/blog.model';
import { SctrTiposervicioComponent } from '../tiposervicio/sctr-tiposervicio.component';
import { SctrVerdatosComponent } from '../verdatos/sctr-verdatos.component';
import { SctrSeguimientoComponent } from '../seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from '../soporte/sctr-soporte.component';
import { AtencionService } from 'src/app/services/atencion.service';

@Component({
  selector: 'app-sctr-bandeja',
  templateUrl: './sctr-bandeja.component.html',
  styleUrl: './sctr-bandeja.component.scss',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MaterialModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatNativeDateModule]
})

export class SctrBandejaComponent implements OnInit {
  displayedColumns: string[] = ['cod_atencion', 'tipo_atencion', 'estado', 'fecha_creacion', 'hora_creacion', 'documento_identidad', 'numero', 'paciente', 'fecha_nacimiento', 'clinica', 'empresa', 'empresa_ruc', 'plan', 'motivo', 'usuario_creacion', 'skill', 'accion'];
  dataSource!: MatTableDataSource<Blog>;

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _atencionService: AtencionService,
    private _snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale("es-pe");
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getBlogList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openSnackBar(message: string, action: string = 'OK') {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  getBlogList() {
    this._atencionService.GetAtencionesList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  deleteAccion(data: Blog) {
    /*this._blogService.deleteBlog(data).subscribe({
      next: (res) => {
        this.openSnackBar('Blog deleted!', 'done');
        this.getBlogList();
      },
      error: console.log,
    });*/
  }

  openEditForm(data: Blog) {
    /*const dialogRef = this._dialog.open(MantblogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBlogList();
        }
      },
    });*/
  }

  openAddEditBlogForm() {
    /*const dialogRef = this._dialog.open(MantblogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBlogList();
        }
      },
    });*/
  }

  openSoporteDialog() {
    this._dialog.open(SctrSoporteComponent);
  }

  openSeguimientoDialog() {
    this._dialog.open(SctrSeguimientoComponent);
  }

  openVerDatosDialog() {
    this._dialog.open(SctrVerdatosComponent);
  }

  openTipoServicioDialog() {
    const dialogRef = this._dialog.open(SctrTiposervicioComponent, {
      disableClose: true,
      width: '350px'
    });
  }

}