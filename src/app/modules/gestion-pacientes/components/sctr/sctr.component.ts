import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { SctrTiposervicioComponent } from './components/tiposervicio/sctr-tiposervicio.component';
import { SctrVerdatosComponent } from './components/verdatos/sctr-verdatos.component';
import { SctrSeguimientoComponent } from './components/seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from './components/soporte/sctr-soporte.component';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { exportExcelService } from 'src/app/helpers/excel/exportxls.services';

@Component({
  selector: 'app-sctr',
  templateUrl: './sctr.component.html',
  styleUrl: './sctr.component.scss'
})

export class SctrComponent implements OnInit {
  reporte = 0;
  idRow = 0;
  rowSeleccionado: any;
  countRows: number = 0;
  positionRow: number;
  displayedColumns: string[] = [];
  headerColumns: string[] = [];
  dataSource!: MatTableDataSource<HistoriaClinica>;
  showSpinner = true;
  rowStyle: string = "";

  constructor(private _liveAnnouncer: LiveAnnouncer, private _dialog: MatDialog, private _historiaClinicaService: HistoriaClinicaService, private dateAdapter: DateAdapter<Date>, private toastService: ToastrService, private exportarExcelService: exportExcelService, private frm: FormBuilder) {
    this.dateAdapter.setLocale("es-pe");
  }

  formularioFiltroAtenciones = this.frm.group({
    txtCodigoAtencion: [''],
    txtTipoAtencion: [''],
    txtFechaCreacion: [''],
    txtEstado: [''],
    txtHoraCreacion: [''],
    txtDocumentoIdentidad: [''],
    txtNumeroDocumento: [''],
    txtPaciente: [''],
    txtFechaNacimiento: [''],
    txtProcedencia: [''],
    txtClinica: [''],
    txtDepartamento: [''],
    txtProvincia: [''],
    txtDistrito: [''],
    txtReporta: [''],
    txtMotivoLlamada: [''],
    txtEmpresa: [''],
    txtEmpresaRuc: [''],
    txtPlan: [''],
    txtMotivo: [''],
    txtUsuarioCreacion: [''],
    txtSkill: ['']
  });

  formularioFiltroReporteSctr = this.frm.group({
    txtStartDateFilter: [new Date(), Validators.required],
    txtEndDateFilter: [new Date(), Validators.required],
    cboReporte: [1, Validators.required],
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    let fechaInicio = this.convertDate(this.formularioFiltroReporteSctr.value["txtStartDateFilter"]);
    let fechaFin = this.convertDate(this.formularioFiltroReporteSctr.value["txtEndDateFilter"]);
    this.reporte = this.formularioFiltroReporteSctr.value["cboReporte"] || 1;
    this.getAtencionesList(fechaInicio, fechaFin, this.reporte);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getAtencionesList(fechaInicio: string, fechaFin: string, reporte: number) {
    this.idRow = 0;
    this.rowSeleccionado = null;

    if (reporte == 1) {
      this.displayedColumns = ['cod_historia_clinica', 'tipo_historia_clinica', 'estado', 'fecha_creacion', 'hora_creacion', 'documento_identidad', 'numero', 'paciente', 'fecha_nacimiento', 'clinica', 'empresa', 'empresa_ruc', 'plan', 'motivo', 'usuario_creacion', 'skill'];
      this.headerColumns = ['CodigoAtencion-search', 'TipoAtencion-search', 'Estado-search', 'FechaCreacion-search', 'HoraCreacion-search', 'DocumentoIdentidad-search', 'NumeroDocumento-search', 'Paciente-search', 'FechaNacimiento-search', 'Clinica-search', 'Empresa-search', 'EmpresaRuc-search', 'Plan-search', 'Motivo-search', 'UsuarioCreacion-search', 'Skill-search'];
    } else {
      this.displayedColumns = ['cod_historia_clinica', 'estado', 'fecha_creacion', 'hora_creacion', 'motivo', 'procedencia', 'clinica', 'departamento', 'provincia', 'distrito', 'persona_reporta', 'motivo_de_llamada', 'usuario_creacion', 'skill'];
      this.headerColumns = ['CodigoAtencion-search', 'Estado-search', 'FechaCreacion-search', 'HoraCreacion-search', 'Motivo-search', 'Procedencia-search', 'Clinica-search', 'Departamento-search', 'Provincia-search', 'Distrito-search', 'Reporta-search', 'MotivoLlamada-search', 'UsuarioCreacion-search', 'Skill-search'];
    }

    this._historiaClinicaService.GetHistoriasClinicasSctrList(fechaInicio, fechaFin, reporte).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
        this.showSpinner = false;
      },
      error: console.log,
    });
  }

  getAtencionesFiltro(fechaInicio: string, fechaFin: string, busqueda: string, condicion: string, reporte: number) {

    if (reporte == 1) {
      this.displayedColumns = ['cod_historia_clinica', 'tipo_historia_clinica', 'estado', 'fecha_creacion', 'hora_creacion', 'documento_identidad', 'numero', 'paciente', 'fecha_nacimiento', 'clinica', 'empresa', 'empresa_ruc', 'plan', 'motivo', 'usuario_creacion', 'skill'];
      this.headerColumns = ['CodigoAtencion-search', 'TipoAtencion-search', 'Estado-search', 'FechaCreacion-search', 'HoraCreacion-search', 'DocumentoIdentidad-search', 'NumeroDocumento-search', 'Paciente-search', 'FechaNacimiento-search', 'Clinica-search', 'Empresa-search', 'EmpresaRuc-search', 'Plan-search', 'Motivo-search', 'UsuarioCreacion-search', 'Skill-search'];
    } else {
      this.displayedColumns = ['cod_historia_clinica', 'estado', 'fecha_creacion', 'hora_creacion', 'motivo', 'procedencia', 'clinica', 'departamento', 'provincia', 'distrito', 'persona_reporta', 'motivo_de_llamada', 'usuario_creacion', 'skill'];
      this.headerColumns = ['CodigoAtencion-search', 'Estado-search', 'FechaCreacion-search', 'HoraCreacion-search', 'Motivo-search', 'Procedencia-search', 'Clinica-search', 'Departamento-search', 'Provincia-search', 'Distrito-search', 'Reporta-search', 'MotivoLlamada-search', 'UsuarioCreacion-search', 'Skill-search'];
    }

    this._historiaClinicaService.GetHistoriaClinicaSctrFiltro(fechaInicio, fechaFin, busqueda, condicion, reporte).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
        this.showSpinner = false;
      },
      error: console.log,
    });
  }

  getRowSelected(row: HistoriaClinica, position: number) {
    this.positionRow = position;
    this.idRow = row["cod_historia_clinica"];
    this.rowSeleccionado = row;
  }

  openSoporteDialog() {
    if (this.idRow != 0) {
      const dialogRef = this._dialog.open(SctrSoporteComponent, {
        panelClass: 'sanna_theme',
        data: { 'datos_atencion': this.rowSeleccionado }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.showSpinner = true;
        let fechaInicio = this.convertDate(this.formularioFiltroReporteSctr.value["txtStartDateFilter"]);
        let fechaFin = this.convertDate(this.formularioFiltroReporteSctr.value["txtEndDateFilter"]);
        this.reporte = this.formularioFiltroReporteSctr.value["cboReporte"] || 1;
        this.getAtencionesList(fechaInicio, fechaFin, this.reporte);
      });

    } else {
      this.toastService.warning('¡Seleccione un registro!');
    }
  }

  openSeguimientoDialog() {
    if (this.idRow != 0) {
      this._dialog.open(SctrSeguimientoComponent, {
        panelClass: 'sanna_theme',
        data: { 'cod_historia_clinica': this.idRow },
      });
    } else {
      this.toastService.warning('¡Seleccione un registro!');
    }
  }

  openVerDatosDialog() {
    if (this.idRow != 0) {
      this._dialog.open(SctrVerdatosComponent, {
        panelClass: 'sanna_theme',
        data: { 'cod_historia_clinica': this.idRow },
      });
    } else {
      this.toastService.warning('¡Seleccione un registro!');
    }
  }

  openTipoServicioDialog() {
    const dialogRef = this._dialog.open(SctrTiposervicioComponent, {
      panelClass: 'sanna_theme',
      disableClose: true,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showSpinner = true;
      let fechaInicio = this.convertDate(this.formularioFiltroReporteSctr.value["txtStartDateFilter"]);
      let fechaFin = this.convertDate(this.formularioFiltroReporteSctr.value["txtEndDateFilter"]);
      this.reporte = this.formularioFiltroReporteSctr.value["cboReporte"] || 1;
      this.getAtencionesList(fechaInicio, fechaFin, this.reporte);
    });
  }

  filterReporteSctr() {
    if (this.formularioFiltroReporteSctr.valid) {
      this.showSpinner = true;
      let fechaInicio = this.convertDate(this.formularioFiltroReporteSctr.value["txtStartDateFilter"]);
      let fechaFin = this.convertDate(this.formularioFiltroReporteSctr.value["txtEndDateFilter"]);
      this.reporte = this.formularioFiltroReporteSctr.value["cboReporte"] || 1;
      this.getAtencionesList(fechaInicio, fechaFin, this.reporte);
    } else {
      this.toastService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  filtrarAtencion(event: Event, condicion: string) {
    if (this.countRows > 0) {
      this.showSpinner = true;
      let fechaInicio = this.convertDate(this.formularioFiltroReporteSctr.value["txtStartDateFilter"]);
      let fechaFin = this.convertDate(this.formularioFiltroReporteSctr.value["txtEndDateFilter"]);

      let valueInput;

      const ds = (event.target as HTMLInputElement).value;
      valueInput = ds === null ? '' : ds;

      if (valueInput == '') {
        this.getAtencionesFiltro(fechaInicio, fechaFin, '', '', this.reporte);
      } else {
        this.getAtencionesFiltro(fechaInicio, fechaFin, valueInput, condicion, this.reporte);
      }

      this.formularioFiltroAtenciones.reset();
      this.formularioFiltroAtenciones.controls["txt" + condicion].setValue(valueInput);
    }
  }

  convertDate(valueDate) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(valueDate)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }

  exportExcel() {
    let nombreArchivo: string;

    if (this.reporte == 1) {
      nombreArchivo = "REPORTE_SCTR";
    } else {
      nombreArchivo = "REPORTE_OTRAS_LLAMADAS_SCTR";
    }

    this.exportarExcelService.exportarXls(this.countRows, this.displayedColumns, nombreArchivo, this.dataSource.data);
  }

}