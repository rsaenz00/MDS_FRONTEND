import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MantblogComponent } from '../mantblog/mantblog.component';
import { MaterialModule } from '../../../material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';
import { SctrTiposervicioComponent } from '../sctr-tiposervicio/sctr-tiposervicio.component';
import { SctrVerdatosComponent } from '../sctr-verdatos/sctr-verdatos.component';
import { SctrSeguimientoComponent } from '../sctr-seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from '../sctr-soporte/sctr-soporte.component';
import { SctrNuevatencionComponent } from '../sctr-nuevatencion/sctr-nuevatencion.component';
import { SctrRegistramotivoComponent } from '../sctr-registramotivo/sctr-registramotivo.component';
import { SctrMantenimientoclinicaComponent } from '../sctr-mantenimientoclinica/sctr-mantenimientoclinica.component';

@Component({
  selector: 'app-sctr-bandeja',
  templateUrl: './sctr-bandeja.component.html',
  styleUrl: './sctr-bandeja.component.scss',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MaterialModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatIconModule, MatNativeDateModule]
})

export class SctrBandejaComponent implements OnInit {
  displayedColumns: string[] = ['id', 'url', 'accion'];
  dataSource!: MatTableDataSource<Blog>;

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _blogService: BlogService,
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
    this._blogService.getBlogList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  deleteBlog(data: Blog) {
    this._blogService.deleteBlog(data).subscribe({
      next: (res) => {
        this.openSnackBar('Blog deleted!', 'done');
        this.getBlogList();
      },
      error: console.log,
    });
  }

  openEditForm(data: Blog) {
    const dialogRef = this._dialog.open(MantblogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBlogList();
        }
      },
    });
  }

  openAddEditBlogForm() {
    const dialogRef = this._dialog.open(MantblogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getBlogList();
        }
      },
    });
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
    this._dialog.open(SctrTiposervicioComponent);
  }

  openNuevoServicioDialog() {
    this._dialog.open(SctrNuevatencionComponent);
  }

  openRegistroEventoDialog() {
    this._dialog.open(SctrRegistramotivoComponent);
  }

  openMantClinicaDialog() {
    this._dialog.open(SctrMantenimientoclinicaComponent);
  }

}