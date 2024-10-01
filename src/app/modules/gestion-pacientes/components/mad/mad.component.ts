import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MatOption } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { ListadoclinicasComponent } from '../sctr/components/sctr-listado-clinicas/listado-clinicas.component';
import { MadSeguimientoComponent } from './components/seguimiento/mad-seguimiento.component';
import { MadNuevaAtencionComponent } from './components/nuevaatencion/mad-nuevaatencion.component';
import { ListadoHistoriaClinica } from 'src/app/models/historia_clinica.model';
import { HistoriaClinicaService } from 'src/app/services/historia_clinica.service';
import { NuevaDireccionComponent } from './components/nuevadireccion/mad-nuevadireccion.component';
import { MadNuevoMedicoComponent } from './components/nuevomedico/mad-nuevomedico.component';
import { ClinicaService } from 'src/app/services/clinica.service';
import { PersonaService } from 'src/app/services/persona.service';
import { DatePipe } from '@angular/common';
import { MensajeComponent } from './components/mensaje/mensaje.component';
import { ConsultaDniComponent } from './components/consultadni/consultadni.component';

var cbocampo = ''
var txtconsulta = '';
var txtValor = '';

@Component({
  selector: 'app-mad',
  templateUrl: './mad.component.html',
  styleUrl: './mad.component.scss',
})

export class MadComponent implements OnInit {
  camposBusqueda =
    [
      '[Seleccionar...]',
      'RAC y fecha',
      'Ruteo y fecha',
      'Sub-zona y fecha',
      'Paciente',
      'Doctor',
      'Aseguradora',
      'Estado SM',
      'Estado Tablet',
      'Programacion',
      'Sia',
      'Provincia',
      'Distrito',
      'Zona',
      'Atencion',
      'Doctor y fecha de atencion',
      'Fecha atencion',
      'Clasificacion',
      'Usuario creador',
      'Dni'
    ];
  camposValor = ['[Seleccionar...]'];

  SeleccionarCampo: string = '';
  SeleccionarValor: string = '';


  vMensajeMad: any;
  vMensajePaciente: any;
  vMensajeEspecialidad: any;
  today: Date = new Date();
  pipe = new DatePipe('es-pe');
  vFechaNacimiento: any;
  vPersonaFechaNacimiento: Date;
  todayWithPipe = null;
  txtConsultar = '';
  cboCampo = "";
  cboNumero = "";
  countRows: number = 0;
  positionRow: number;
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<ListadoHistoriaClinica>;
  showSpinner = true;
  rowStyle: string = "";
  footerToDisplayed: string[] = ["footer"];
  vDni = 0;
  constructor
    (
      private _personaService: PersonaService,
      private _clinicaService: ClinicaService,
      private toastrService: ToastrService,
      private _liveAnnouncer: LiveAnnouncer,
      private _dialog: MatDialog,
      private _historiaclinicaService: HistoriaClinicaService,
      private dataAdapter: DateAdapter<Date>,
      private frm: FormBuilder,
      private toastService: ToastrService,
      //public _dialogRef: MatDialogRef<MadComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    this.dataAdapter.setLocale("es-pe");
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getHistoriaClinicaList();
    //todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy'); 
  }

  FormularioBandejaMad = this.frm.group({
    cboCampo: [{ value: '', disabled: false }, Validators.required],
    cboNumero: [{ value: '', disabled: false }],
    txtConsulta: [{ value: '', disabled: false }],
    dtpIni: [new Date(), Validators.required],
    dtpFin: [new Date(), Validators.required],
    chkGeneral: [true],
    chkPediatria: [true],
    chkOtras: [true],
    chkFinalizadas: [false]
  });

  //FILTRO DETALLE DE BANDEJA DE MAD 
  FormularioFiltroHistoria = this.frm.group({
    txtE: [''],
    txtPROG: [''],
    txtCODATE: [''],
    txtCLASIF: [''],
    txtE_TABLET: [''],
    txtCODAUTORIZACION: [''],
    txtFECLLA: [''],
    txtHRLLA: [''],
    txtTIEMPO: [''],
    txtFECATE: [''],
    txtHRXDEFECTO: [''],
    txtHRESTIMADA: [''],
    txtHRLLEGADA: [''],
    txtPROVINCIA: [''],
    txtDISTRITO: [''],
    txtPACIENTE: [''],
    txtFPAGO: [''],
    txtVIP: [''],
    txtGRUPO: [''],
    txtPERIODO: [''],
    txtCONT: [''],
    txtPERFIL: [''],
    txtESPEC: [''],
    txtDOCTOR: [''],
    txtGRUPOS: [''],
    txtEMPRESA: [''],
    txtUSUARIO: [''],
    txtCOD_DOC: [''],
  });
  //-------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------COMBO CAMPO
  selectCampo() {
    this.vCampo = this.FormularioBandejaMad.value["cboCampo"]?.toString() || '';
    //console.log(this.vCampo);
    if (this.vCampo == '[Seleccionar...]') {
      this.camposValor = [''];
    }
    else if (this.vCampo == 'RAC y fecha') {
      this.camposValor = ['Todos', '1', '2,3,6', '4,5', '7,8', '10,11', '9,12'];
    }
    else if (this.vCampo == 'Ruteo y fecha') {
      this.camposValor = ['Todos', '1', '2,3,4'];
    }
    else if (this.vCampo == 'Sub-zona y fecha') {
      this.camposValor = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    }
    else if (this.vCampo == 'Paciente') {
      this.camposValor = ['Seleccionar...'];
      console.log(this.vCampo);
    }
    else {

    }

    //this.SeleccionarValor = vCampo;   
    //console.log('Selected option: ${this.SeleccionarValor}'); 
  }
  selectCliente(option: MatOption) {
    //this.codCliente = option.value.id_cliente; 
    //vAseguradora = option.value.nombre;   
  }
  //-------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------LISTADO DE TODAS LAS HISTORIA CLINICAS
  getHistoriaClinicaList() {
    this.displayedColumns = ['e', 'prog', 'codate', 'clasif', 'e_tablet', 'codautorizacion', 'feclla', 'hrlla', 'tiempo', 'fecate', 'hrxdefecto', 'hrestimada', 'hrllegada', 'provincia', 'distrito', 'paciente', 'fpago', 'vip', 'grupo', 'periodo', 'cont', 'perfil', 'espec', 'doctor', 'grupos', 'empresa', 'usuario', 'cod_doc'];
    this._historiaclinicaService.GetHistoriaClinicasList().subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }
  //-------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------LISTADO DE TODAS LAS HISTORIA CLINICAS
  getFiltroEncabezadoHistoriaClinicaList(vCampoBusqueda: string, vValorBusqueda: string, vFechaInicio: string, vFechaFinal: string) {
    this.displayedColumns = ['e', 'prog', 'codate', 'clasif', 'e_tablet', 'codautorizacion', 'feclla', 'hrlla', 'tiempo', 'fecate', 'hrxdefecto', 'hrestimada', 'hrllegada', 'provincia', 'distrito', 'paciente', 'fpago', 'vip', 'grupo', 'periodo', 'cont', 'perfil', 'espec', 'doctor', 'grupos', 'empresa', 'usuario', 'cod_doc'];
    this._historiaclinicaService.GetHistoriaClinicaMadFiltro(vCampoBusqueda, vValorBusqueda, vFechaInicio, vFechaFinal).subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.dataSource = new MatTableDataSource(res.resultData);
        console.log(new MatTableDataSource(res.resultData));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }
  //--------------------------------------------------------LISTADO DE TODAS LAS HISTORIA CLINICAS
  getFiltroEncabezadoHistoriaClinicaRangoByFechasList(vFechaInicio: string, vFechaFinal: string) {
    this.displayedColumns = ['e', 'prog', 'codate', 'clasif', 'e_tablet', 'codautorizacion', 'feclla', 'hrlla', 'tiempo', 'fecate', 'hrxdefecto', 'hrestimada', 'hrllegada', 'provincia', 'distrito', 'paciente', 'fpago', 'vip', 'grupo', 'periodo', 'cont', 'perfil', 'espec', 'doctor', 'grupos', 'empresa', 'usuario', 'cod_doc'];
    this._historiaclinicaService.GetHistoriaClinicaMadFiltro_Rango_By_Fechas(vFechaInicio, vFechaFinal).subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.dataSource = new MatTableDataSource(res.resultData);
        console.log(new MatTableDataSource(res.resultData));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }
  //--------------------------------------------------------LISTADO DE TODAS LAS HISTORIA CLINICAS
  getFiltroEncabezadoHistoriaClinicaCamposList(vCampoBusqueda: string, vValorBusqueda: string) {
    this.displayedColumns = ['e', 'prog', 'codate', 'clasif', 'e_tablet', 'codautorizacion', 'feclla', 'hrlla', 'tiempo', 'fecate', 'hrxdefecto', 'hrestimada', 'hrllegada', 'provincia', 'distrito', 'paciente', 'fpago', 'vip', 'grupo', 'periodo', 'cont', 'perfil', 'espec', 'doctor', 'grupos', 'empresa', 'usuario', 'cod_doc'];
    this._historiaclinicaService.GetHistoriaClinicaMadFiltro_Campos(vCampoBusqueda, vValorBusqueda).subscribe({
      next: (res) => {
        this.showSpinner = false;
        this.dataSource = new MatTableDataSource(res.resultData);
        console.log(new MatTableDataSource(res.resultData));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }
  vCampo = '';
  vValor = '';
  vFechaInicio = '';
  vFechaFinal = '';
  vTurno = 0;
  ConsultarEncabezado() {
    this.showSpinner = true;
    this.vFechaInicio = this.convertDate(this.FormularioBandejaMad.value["dtpIni"]);
    this.vFechaFinal = this.convertDate(this.FormularioBandejaMad.value["dtpFin"]);
    this.vCampo = this.FormularioBandejaMad.value["cboCampo"] || '';
    this.vValor = this.FormularioBandejaMad.value["txtConsulta"]?.toString() || '';
    if (this.vFechaInicio != '' && this.vFechaFinal != '') {
      this.getFiltroEncabezadoHistoriaClinicaRangoByFechasList(this.vFechaInicio, this.vFechaFinal);
    }

    if (this.vCampo != '' && this.vValor != '') {
      this.getFiltroEncabezadoHistoriaClinicaCamposList(this.vCampo, this.vValor);
    }

    if (this.vFechaInicio != '' && this.vFechaFinal != '' && this.vCampo != '' && this.vValor != '') {
      console.log(this.vFechaInicio);
      console.log(this.vFechaFinal);
      console.log(this.vCampo);
      console.log(this.vValor);
      this.getFiltroEncabezadoHistoriaClinicaRangoByFechasList(this.vFechaInicio, this.vFechaFinal);
      this.getFiltroEncabezadoHistoriaClinicaCamposList(this.vCampo, this.vValor);
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    }
    else {
      this._liveAnnouncer.announce(`Sorting cleared`);
    }
  }
  convertDate(valueDate) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(valueDate)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }
  FechaNacimiento() {
    if (this.FormularioBandejaMad.value["dtpIni"]?.toString() != '') {
      this.vFechaNacimiento = this.FormularioBandejaMad.value["dtpIni"]?.toString();
      this.vPersonaFechaNacimiento = new Date(this.vFechaNacimiento);
    }
  }
  //-----------------------------------------------------------BOTONES DE LA BANDEJA DE MAD
  //BOTON SEGUIMIENTO
  openMadSeguimientoDialog() {

  }
  //BOTON NUEVA ATENCION
  openMadNuevaAtencionDialog() {
    this._dialog.open(MadNuevaAtencionComponent,
      {
        panelClass: `sanna_theme`,
        disableClose: true
      }
    );
  }
  //---------------------------------------------------------------------------
  openMadNuevoMedicoDialog() {
    this._dialog.open(MadNuevoMedicoComponent,
      {
        panelClass: `sanna_theme`
      }
    );
  }
  //--------------------------------------------------------------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------INICIO PARA BUSQUEDA POR DNI
  openClinicaDialog() {
    const dialogRef = this._dialog.open(ConsultaDniComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //BOTON NUEVA ATENCION
  openMadSoporteDialog() {
    this._dialog.open(NuevaDireccionComponent,
      {
        panelClass: `sanna_theme`,
      }
    );
  }
}

