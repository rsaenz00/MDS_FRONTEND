import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, } from '@angular/material-moment-adapter';
import { BaseComponent } from 'src/app/base/base.component';
import { AmbulanciaDataSource } from './ambulancia-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ambulancia } from 'src/app/models/ambulancia.model';
import { AmbulanciaResource } from 'src/app/models/resources/ambulancia-resource';
import { Observable, debounceTime, distinctUntilChanged, merge, tap } from 'rxjs';
import { interval } from 'rxjs';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ResponseHeader } from 'src/app/models/resources/response-header';
import { AmbulanciaService } from 'src/app/services/ambulancia.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AmbSoporteComponent } from './components/amb-soporte/amb-soporte.component';
import { AmbNuevoServicioComponent } from './components/amb-nuevo-servicio/amb-nuevo-servicio.component';
import { AmbNuevaAlertaComponent } from './components/amb-nueva-alerta/amb-nueva-alerta.component';
import { AmbAlertasComponent } from './components/amb-alertas/amb-alertas.component';
import { AmbDatosAtencionComponent } from './components/amb-datos-atencion/amb-datos-atencion.component';
import { AmbSeguimientoComponent } from './components/amb-seguimiento/amb-seguimiento.component';
import { AmbAtencionesPasadasComponent } from './components/amb-atenciones-pasadas/amb-atenciones-pasadas.component';
import { CommonDialogService } from 'src/app/services/common-dialog.service';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';
import { ToastrService } from 'ngx-toastr';
// import moment from 'moment';

// const moment = require('moment');
// let offSetDesde = dtpDesde.getTimezoneOffset() * 60 * 1000;

let dtpHasta = new Date();
new Date(dtpHasta.setDate(dtpHasta.getDate() + 1));
// let offSetDesde = 


@Component({
  selector: 'app-ambulancia',
  templateUrl: './ambulancia.component.html',
  styleUrl: './ambulancia.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers:
    [
      {
        provide: MAT_DATE_LOCALE, useValue: 'es-PE'
      },
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
      },
      { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})

export class AmbulanciaComponent extends BaseComponent implements OnInit, AfterViewInit {
  hoyFecha = new Date();
  fechaInicio = this.convertDate(this.hoyFecha);
  fechaFin = this.convertDate(this.hoyFecha);
  positionRow: number;
  idRow = 0;
  rowSeleccionado: any;

  dataSource: AmbulanciaDataSource;
  ambulancia: Ambulancia[] = [];
  ambulanciaResource: AmbulanciaResource;
  displayedColumns: string[] =
    [
      'cod_historia_clinica',
      'cod_siteds',
      'cotizado',
      'estado',
      'ambulancia_respiratoria',
      'servicio',
      'paciente',
      'numero_documento_id',
      'empresa',
      'especialidad',
      'centro_medico_derivado',
      'motivo_atencion',
      'usuario_creacion',
      'fuera_cobertura',
      'contratante_citrix'
    ];

  footerToDisplayed: string[] = ["footer"];
  isLoadingResults = true;
  loading$: Observable<boolean>;
  tiempoSincronizacionAutomatica = interval(40000);//40 segundos
  estadoSincronizacionAutomatica;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  searchFormGroup: UntypedFormGroup;
  codigoAtencionFilterCtl: UntypedFormControl = new UntypedFormControl('');
  codigoSitedFilterCtl: UntypedFormControl = new UntypedFormControl('');
  cotizadoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  estadoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  servicioFilterCtl: UntypedFormControl = new UntypedFormControl('');
  ambulanciaRespuestaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  pacienteFilterCtl: UntypedFormControl = new UntypedFormControl('');
  numeroDocumentoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  departamentoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  provinciaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  distritoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  direccionFilterCtl: UntypedFormControl = new UntypedFormControl('');
  referenciaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  clienteFilterCtl: UntypedFormControl = new UntypedFormControl('');
  proveedorFilterCtl: UntypedFormControl = new UntypedFormControl('');
  ambulanciaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  tiempoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  fechaEstimadaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  horaEstimadaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  fechaLlegadaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  horaLlegadaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  fechaFinAtencionFilterCtl: UntypedFormControl = new UntypedFormControl('');
  horaFinAtencionFilterCtl: UntypedFormControl = new UntypedFormControl('');
  telefonoCelularFilterCtl: UntypedFormControl = new UntypedFormControl('');
  usuarioCreacionFilterCtl: UntypedFormControl = new UntypedFormControl('');
  motivoFilterCtl: UntypedFormControl = new UntypedFormControl('');
  flagFueraCoberturaFilterCtl: UntypedFormControl = new UntypedFormControl('');
  flagCitrixFilterCtl: UntypedFormControl = new UntypedFormControl('');
  estadoExpFilterCtl: UntypedFormControl = new UntypedFormControl('');
  codigoProvFilterCtl: UntypedFormControl = new UntypedFormControl('');

  constructor
    (
      private dialog: MatDialog,
      private adapter: DateAdapter<any>,
      @Inject(MAT_DATE_LOCALE) private locale: string,
      private formBuilder: UntypedFormBuilder,
      private ambulanciaService: AmbulanciaService,
      private _historiaClinicaService: HistoriaClinicaService,
      private commonDialogService: CommonDialogService,
      private toastService: ToastrService
    ) {
    super();
    this.ambulanciaResource = new AmbulanciaResource();
    this.ambulanciaResource.pageSize = 10;
    this.ambulanciaResource.codigoAtencion = 'ALL';
    this.ambulanciaResource.codigoSited = 'ALL';
    this.ambulanciaResource.cotizado = 'ALL';
    this.ambulanciaResource.estado = 'ALL';
    this.ambulanciaResource.ambulanciaRespuesta = 'ALL';
    this.ambulanciaResource.servicio = 'ALL';
    this.ambulanciaResource.paciente = 'ALL';
    this.ambulanciaResource.numeroDocumento = 'ALL';
    this.ambulanciaResource.departamento = 'ALL';
    this.ambulanciaResource.provincia = 'ALL';
    this.ambulanciaResource.distrito = 'ALL';
    this.ambulanciaResource.direccion = 'ALL';
    this.ambulanciaResource.referencia = 'ALL';
    this.ambulanciaResource.cliente = 'ALL';
    this.ambulanciaResource.proveedor = 'ALL';
    this.ambulanciaResource.ambulancia = 'ALL';
    this.ambulanciaResource.tiempo = 'ALL';
    this.ambulanciaResource.fechaEstimada = 'ALL';
    this.ambulanciaResource.horaEstimada = 'ALL';
    this.ambulanciaResource.fechaLlegada = 'ALL';
    this.ambulanciaResource.horaLlegada = 'ALL';
    this.ambulanciaResource.fechaFinAtencion = 'ALL';
    this.ambulanciaResource.horaFinAtencion = 'ALL';
    this.ambulanciaResource.telefonoCelular = 'ALL';
    this.ambulanciaResource.usuarioCreacion = 'ALL';
    this.ambulanciaResource.motivo = 'ALL';
    this.ambulanciaResource.flagFueraCobertura = 'ALL';
    this.ambulanciaResource.flagCitrix = 'ALL';
    this.ambulanciaResource.estadoExp = 'ALL';
    this.ambulanciaResource.codigoProv = 'ALL';

    //this.ambulanciaResource.fechaDesde = this.convertDate(this.hoyFecha.toString());
    this.ambulanciaResource.fechaDesde = this.fechaInicio.toString();
    //this.ambulanciaResource.fechaHasta = this.convertDate(this.hoyFecha.toString());
    this.ambulanciaResource.fechaHasta = this.fechaFin.toString();

    this.ambulanciaResource.flagUrgEmeTras = true;
    this.ambulanciaResource.flagEventos = true;
    this.ambulanciaResource.flagOmedica = false;
    this.ambulanciaResource.flagCanceladas = false;
    this.ambulanciaResource.flagFinalizadas = false;
  }

  /*convertDate(value:string): string 
  {
    let newDate = new Date(value);
    newDate.setHours(0,0,0,0);
    let result = newDate.getTime().toString();
    return result;
  }*/

  convertDate(valueDate) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(valueDate)
    return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-')
  }

  get formControl() {
    return this.searchFormGroup.controls;
  }

  createFormGroup(): void {
    this.searchFormGroup = this.formBuilder.group({
      dtpDesde: [this.hoyFecha],
      dtpHasta: [this.hoyFecha],
      chkSincronizacionAutomatica: [false],
      chkUrgEmeTras: [true],
      chkEventos: [true],
      chkOmedica: [false],
      chkCanceladas: [false],
      chkFinalizadas: [false],
    });
  }

  ngOnInit(): void {
    this.locale = 'es';
    this.adapter.setLocale(this.locale);
    this.createFormGroup();

    //this.dataSource = new AmbulanciaDataSource(this.ambulanciaService);
    this.dataSource = new AmbulanciaDataSource(this._historiaClinicaService);
    this.dataSource.loadAmbulancia(this.ambulanciaResource);
    this.getResourceParameter();

    this.filterLogic()
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.ambulanciaResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.ambulanciaResource.pageSize = this.paginator.pageSize;
          this.ambulanciaResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadAmbulancia(this.ambulanciaResource);
        })
      )
      .subscribe();
  }

  filterLogic() {
    // console.log(this.convertDate(this.searchFormGroup.get('cdtpHasta')?.value));

    // CODIGO DE ATENCION
    this.sub$.sink =
      this.codigoAtencionFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {

            this.ambulanciaResource.codigoAtencion = c == '' ? 'ALL' : c;
            this.ambulanciaResource.fechaDesde = this.convertDate(this.searchFormGroup.get('dtpDesde')?.value);
            this.ambulanciaResource.fechaHasta = this.convertDate(this.searchFormGroup.get('dtpHasta')?.value);
            this.ambulanciaResource.flagUrgEmeTras = this.searchFormGroup.get('chkUrgEmeTras')?.value;
            this.ambulanciaResource.flagEventos = this.searchFormGroup.get('chkEventos')?.value;
            this.ambulanciaResource.flagOmedica = this.searchFormGroup.get('chkOmedica')?.value;
            this.ambulanciaResource.flagCanceladas = this.searchFormGroup.get('chkCanceladas')?.value;
            this.ambulanciaResource.flagFinalizadas = this.searchFormGroup.get('chkFinalizadas')?.value;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // CODIGO SITED
    this.sub$.sink =
      this.codigoSitedFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.codigoSited = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // COTIZADO
    this.sub$.sink =
      this.cotizadoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.cotizado = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // ESTADO
    this.sub$.sink =
      this.estadoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.estado = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // AMBULANCIA RESPUESTA
    this.sub$.sink =
      this.ambulanciaRespuestaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.ambulanciaRespuesta = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // SERVICIO
    this.sub$.sink =
      this.servicioFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.servicio = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // PACIENTE
    this.sub$.sink =
      this.pacienteFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.paciente = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // NUMERO DOCUMENTO
    this.sub$.sink =
      this.numeroDocumentoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.numeroDocumento = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // DEPARTAMENTO
    this.sub$.sink =
      this.departamentoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.departamento = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // PROVINCIA
    this.sub$.sink =
      this.provinciaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.provincia = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // DISTRITO
    this.sub$.sink =
      this.distritoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.distrito = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // DIRECCION
    this.sub$.sink =
      this.direccionFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.direccion = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // REFERENCIA
    this.sub$.sink =
      this.referenciaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.referencia = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // CLIENTE
    this.sub$.sink =
      this.clienteFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.cliente = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // PROVEEDOR
    this.sub$.sink =
      this.proveedorFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.proveedor = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // AMBULANCIA
    this.sub$.sink =
      this.ambulanciaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.ambulancia = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // TIEMPO
    this.sub$.sink =
      this.tiempoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.tiempo = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // FECHA ESTIMADA
    this.sub$.sink =
      this.fechaEstimadaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.fechaEstimada = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // HORA ESTIMADA
    this.sub$.sink =
      this.horaEstimadaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.horaEstimada = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // FECHA LLEGADA
    this.sub$.sink =
      this.fechaLlegadaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.fechaLlegada = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // HORA LLEGADA
    this.sub$.sink =
      this.horaLlegadaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.horaLlegada = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // FECHA FIN ATENCION
    this.sub$.sink =
      this.fechaFinAtencionFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.fechaFinAtencion = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // HORA FIN ATENCION
    this.sub$.sink =
      this.horaFinAtencionFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.horaFinAtencion = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // TELEFONO CELULAR
    this.sub$.sink =
      this.telefonoCelularFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.telefonoCelular = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // USUARIO CREACION
    this.sub$.sink =
      this.usuarioCreacionFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.usuarioCreacion = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // MOTIVO
    this.sub$.sink =
      this.motivoFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.motivo = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // FLAG FUERA DE COBERTURA
    this.sub$.sink =
      this.flagFueraCoberturaFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.flagFueraCobertura = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // FLAG CITRIX
    this.sub$.sink =
      this.flagCitrixFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.flagCitrix = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // ESTADO EXP
    this.sub$.sink =
      this.estadoExpFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.estadoExp = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );

    // CODIGO PROV
    this.sub$.sink =
      this.codigoProvFilterCtl.valueChanges.pipe
        (
          debounceTime(400),
          distinctUntilChanged()
        ).subscribe
        (
          c => {
            this.ambulanciaResource.codigoProv = c == '' ? 'ALL' : c;
            this.ambulanciaResource.skip = 0;
            this.dataSource.loadAmbulancia(this.ambulanciaResource);
          }
        );
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader | any) => {
        if (c) {
          this.ambulanciaResource.pageSize = c.pageSize;
          this.ambulanciaResource.skip = c.skip;
          this.ambulanciaResource.totalCount = c.totalCount;
        }
      });
  }

  filtrar(): void {
    this.ambulanciaResource.fechaDesde = this.convertDate(this.searchFormGroup.get('dtpDesde')?.value);
    this.ambulanciaResource.fechaHasta = this.convertDate(this.searchFormGroup.get('dtpHasta')?.value);
    this.ambulanciaResource.flagUrgEmeTras = this.searchFormGroup.get('chkUrgEmeTras')?.value;
    this.ambulanciaResource.flagEventos = this.searchFormGroup.get('chkEventos')?.value;
    this.ambulanciaResource.flagOmedica = this.searchFormGroup.get('chkOmedica')?.value;
    this.ambulanciaResource.flagCanceladas = this.searchFormGroup.get('chkCanceladas')?.value;
    this.ambulanciaResource.flagFinalizadas = this.searchFormGroup.get('chkFinalizadas')?.value;
    this.ambulanciaResource.skip = 0;
    this.dataSource.loadAmbulancia(this.ambulanciaResource);
    //alert(this.ambulanciaResource.fechaDesde + '-' + this.ambulanciaResource.fechaHasta)
  }

  openSoporte() {
    if (this.idRow != 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = false;
      dialogConfig.width = '500px'
      dialogConfig.data = { 'datos_atencion': this.rowSeleccionado };

      const dialogRef = this.dialog.open
        (
          AmbSoporteComponent, dialogConfig
          // {
          //   width: '500px',
          //   // data: Object.assign({}, usuario)
          // }
        );

      dialogRef.afterClosed().subscribe(result => {
        this.filtrar();
      });
    } else {
      this.toastService.warning('¡Seleccione un registro!');
    }

    // const dialogConfig = new MatDialogConfig();


    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //     id: 1,
    //     title: 'Angular For Beginners'
    // };

    // this.dialog.open(AmbSoporteComponent, dialogConfig);

    // const dialogRef = this.dialog.open(AmbSoporteComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //     data => console.log("Dialog output:", data)
    // );    
  }

  openNuevoServicio() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '400px'

    const dialogRef = this.dialog.open
      (
        AmbNuevoServicioComponent, dialogConfig
        // {
        //   width: '500px',
        //   // data: Object.assign({}, usuario)
        // }
      );

    dialogRef.afterClosed().subscribe(result => {
      this.filtrar();
      this.dataSource.loadAmbulancia(this.ambulanciaResource);
    });
  }

  openNuevaAlerta() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '700px'

    this.dialog.open
      (
        AmbNuevaAlertaComponent,
        dialogConfig
        // {
        //   width: '700px',
        //   // data: Object.assign({}, usuario)
        // }
      );
  }

  openAlertas() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '1024px'

    this.dialog.open
      (
        AmbAlertasComponent,
        dialogConfig
        // {
        //   width: '1024px',
        //   // data: Object.assign({}, usuario)
        // }
      );
  }

  openDatosAtencion() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '500px';

    this.dialog.open
      (
        AmbDatosAtencionComponent,
        dialogConfig
        // {
        //   width: '500px',
        //   // data: Object.assign({}, usuario)
        // }
      );
  }

  openSeguimiento() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '1024px';

    this.dialog.open
      (
        AmbSeguimientoComponent,
        dialogConfig
        // {
        //   width: '1024px',
        //   // data: Object.assign({}, usuario)
        // }
      );
  }

  openAtencionesPasadas() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '1024px';

    this.dialog.open
      (
        AmbAtencionesPasadasComponent,
        dialogConfig
        // {
        //   width: '500px',
        //   // data: Object.assign({}, usuario)
        // }
      );
  }

  openValidarLlegada() {
    this.sub$.sink = this.commonDialogService
      .ConfirmationDialog(`Esta seguro que desea eliminar`)
      .subscribe((isTrue: boolean) => {
        // if (isTrue) 
        // {
        //   this.sub$.sink = this.usuarioService.deleteUser(usuario.id ?? '')
        //   .subscribe(() => 
        //   {
        //     this.toastrService.success('Eliminado');
        //     this.paginator.pageIndex = 0;
        //     this.usuarioResource.name = this.input.nativeElement.value;
        //     this.dataSource.loadUsers(this.usuarioResource);
        //   });
        // }
      });
  }

  getCustomCss(estado, cod_atencion) {
    switch (estado) {
      case '1':
        {
          return 'semaphore-green';
        }
      case '2':
        {
          return 'semaphore-yellow-light';
        }
      case '3':
        {
          return 'semaphore-orange';
        }
      case '4':
        {
          return 'semaphore-red';
        }
      case '5':
        {
          return 'semaphore-blue';
        }
      case '6':
        {
          return 'semaphore-white';
        }
      case '7':
        {
          return 'semaphore-grey';
        }
      case '8':
        {
          return 'semaphore-rose';
        }
      case 'C':
        {
          return 'semaphore-grey';
        }
      default: {
        return ''
        break;
      }
    }
    // if(estado === '1' && cod_atencion === '5424779')
    // {
    //   return 'semaphore-red';
    // }
    // else if(estado === '1')
    // {
    //   return 'semaphore-blue';
    // }
    // else
    // {
    //   return '';
    // }
  }

  getRowSelected(row: HistoriaClinica, position: number) {
    this.positionRow = position;
    this.idRow = row["cod_historia_clinica"];
    this.rowSeleccionado = row;
  }

  activarSincronizacionAutomatica(event: MatCheckboxChange): void {
    if (event.checked) {
      this.estadoSincronizacionAutomatica = this.tiempoSincronizacionAutomatica.subscribe((val) => {
        this.dataSource = new AmbulanciaDataSource(this._historiaClinicaService);
        this.dataSource.loadAmbulancia(this.ambulanciaResource);
        this.getResourceParameter();
      });
    } else {
      this.estadoSincronizacionAutomatica.unsubscribe();
    }
  }
}
