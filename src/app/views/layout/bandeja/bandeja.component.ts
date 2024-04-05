import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MantblogComponent } from '../mantblog/mantblog.component';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.component.html',
  styleUrl: './bandeja.component.scss',
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatPaginatorModule, MaterialModule],
})

export class BandejaComponent implements /*AfterViewInit,*/ OnInit {
  displayedColumns: string[] = ['id', 'url', 'accion'];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource!: MatTableDataSource<Blog>;

  constructor(private _liveAnnouncer: LiveAnnouncer,
    private _dialog: MatDialog,
    private _blogService: BlogService,
    private _snackBar: MatSnackBar) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getBlogList();
  }

  /*ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }*/

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openSnackBar(message: string, action: string = 'ok') {
    this._snackBar.open(message, action, {
      duration: 1000,
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

}

/*export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}*/

/*const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];*/