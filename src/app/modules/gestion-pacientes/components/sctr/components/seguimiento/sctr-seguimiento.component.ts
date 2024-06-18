import { Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Seguimiento } from 'src/app/models/seguimiento.model';
import { SeguimientoService } from 'src/app/services/seguimiento.servcie';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { UsuarioAuth } from 'src/app/models/usuario-auth';

@Component({
  selector: 'app-sctr-seguimiento',
  templateUrl: './sctr-seguimiento.component.html',
  styleUrl: './sctr-seguimiento.component.scss',
})

export class SctrSeguimientoComponent {
  displayedColumns = ['cod_atencion', 'servicio', 'fecha_creacion', 'hora_creacion', 'observacion', 'usuario'];
  dataSource!: MatTableDataSource<Seguimiento>;
  id_atencion: any;
  countRows: number = 0;
  seguimiento: Seguimiento = {} as Seguimiento;
  usuarioEnlinea: UsuarioAuth;

  constructor(private _liveAnnouncer: LiveAnnouncer, private frm: FormBuilder, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _seguimientoService: SeguimientoService, private toastrService: ToastrService) {
    this.id_atencion = data.cod_atencion
  }

  frmSeguimientoSctr = this.frm.group({
    txtCodigo: ['', Validators.required],
    txtObservacion: ['', Validators.required]
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('TABLE') table: ElementRef;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.frmSeguimientoSctr.get("txtCodigo")?.setValue(this.id_atencion);
    this.getSeguimientoList(this.id_atencion);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  searchSeguimiento() {
    if (this.frmSeguimientoSctr.value["txtCodigo"] != null) {
      this.getSeguimientoList(this.frmSeguimientoSctr.value["txtCodigo"] || '');
    } else {
      this.toastrService.warning('¡Por favor ingrese el código de la atención!');
    }
  }

  getSeguimientoList(cod_atencion: string) {
    this._seguimientoService.GetSeguimientoByAtencion(cod_atencion).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  saveSeguimiento() {
    if (this.frmSeguimientoSctr.valid) {
      this.seguimiento.cod_atencion = this.id_atencion.toString();
      this.seguimiento.observacion = this.frmSeguimientoSctr.value["txtObservacion"] || '';
      this.seguimiento.usuario = this.usuarioEnlinea.id?.toString() || '';

      this._seguimientoService.AddSeguimientoSctr(this.seguimiento).subscribe({
        next: (val: any) => {
          this.toastrService.success('¡Seguimiento creado satisfactoriamene!');
          this.getSeguimientoList(this.id_atencion);
          this.frmSeguimientoSctr.controls['txtObservacion'].reset();
        },
        error: (err: any) => {
          console.error(err);
        },
      });

    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

}