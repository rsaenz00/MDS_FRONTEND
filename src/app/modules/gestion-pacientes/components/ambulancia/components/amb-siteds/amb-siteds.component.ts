import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { Afiliado, Coberturas, Request_AsegCod_Obs_DatAdic_CondMed, Request_Asegurado, Request_NumeroAutorizacion, Response_Siteds } from 'src/app/models/siteds.model';
import { SitedsService } from 'src/app/services/siteds.service';
import { MatPaginator } from '@angular/material/paginator';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Siteds } from 'src/app/models/siteds.model';
import { ClienteSiteds } from 'src/app/models/cliente.model';
import { CoreService } from 'src/app/services/core.service';
import { MatOption } from '@angular/material/core';
import { ListadopacientesComponent } from '../../../sctr/components/sctr-listado-pacientes/listado-pacientes.component';
import { AmbNuevaAtencionComponent } from '../amb-nueva-atencion/amb-nueva-atencion.component';
import { AmbNuevoEventoComponent } from '../amb-nuevo-evento/amb-nuevo-evento.component';
import { AmbNuevaOrientacionMedicaComponent } from '../amb-nueva-orientacion-medica/amb-nueva-orientacion-medica.component';
import { limpiarLetras, limpiarNumero, rellenaCaracteres, soloLetras, soloNumeros } from 'src/app/util/forms.validate';

@Component({
  selector: 'app-amb-siteds',
  templateUrl: './amb-siteds.component.html',
  styleUrl: './amb-siteds.component.scss'
})

export class AmbSitedsComponent implements OnInit {
  options = this.settings.getOptions();
  usuarioEnlinea: UsuarioAuth;
  tipoDocumentos: TipoDocumento[];
  clientes: ClienteSiteds[];
  filterOptionsClientes: ClienteSiteds[];
  displayedColumnsAsegurados: string[] = [];
  displayedColumnsBeneficios: string[] = [];
  dataSourceAsegurados!: MatTableDataSource<Afiliado>;
  dataSourceBeneficios!: MatTableDataSource<Coberturas>;
  requestAsegurado: Request_Asegurado = {} as Request_Asegurado;
  requestAseguradoCodigo: Request_AsegCod_Obs_DatAdic_CondMed = {} as Request_AsegCod_Obs_DatAdic_CondMed;
  requestNumeroAutorizacion: Request_NumeroAutorizacion = {} as Request_NumeroAutorizacion;
  siteds: Siteds = {} as Siteds;
  afiliado: Response_Siteds;
  rowSeleccionado: any;
  base64_pdf: string;
  numeroAutorizacion: string;
  codCliente: string;
  codFinancimientoCliente: string;
  valCliente: string;
  vFecha1: string;
  vFecha2: string;
  vCodmoneda: string;
  vCodFechaFinCarencia: string;
  msgBusqueda: string = '';
  positionRow: number;
  positionRow2: number;
  valTipoDocumento = 0;
  tabActivo = 0;
  showSpinner = false;
  statusBtnBuscarPaciente = false;
  statusBtnDocIdentidad = false;
  statusBtnObservaciones = true;
  statusBtnGenerarAutorizacion = true;
  statusBtnVerDocAutorizacion = true;
  tabDatosAsegurado = true;

  private _count;
  public get count(): number {
    return this._count;
  }

  constructor(
    private settings: CoreService,
    private _dialog: MatDialog,
    public _dialogRef: MatDialogRef<AmbSitedsComponent>,
    private _clienteService: ClienteService,
    private _historiaclinicaService: HistoriaClinicaService,
    private _liveAnnouncer: LiveAnnouncer,
    private toastrService: ToastrService,
    private frm: FormBuilder,
    private _tipodocumentoService: TipoDocumentoService,
    private _sitedsServices: SitedsService) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("cboCliente") cboCliente: ElementRef;
  @ViewChild("txtNroDocumento") txtNroDocumento: ElementRef;

  formBuscarPorDocumentoIdentidad = this.frm.group({
    cboTipoDocumento: [{ value: '1', disabled: false }, Validators.required],
    txtNroDocumento: [{ value: '', disabled: false }, Validators.required]
  });

  formBuscarPorDatosCompletos = this.frm.group({
    txtApellidoPaterno: [{ value: '', disabled: false }, Validators.required],
    txtApellidoMaterno: [{ value: '', disabled: false }],
    txtNombres: [{ value: '', disabled: false }, Validators.required]
  });

  formDatosCompletosAsegurado = this.frm.group({
    txtNroAutorizacion: [{ value: '', disabled: true }],
    txtCodAsegurado: [{ value: '', disabled: true }],
    txtNroDeclaracionAccidente: [{ value: '', disabled: true }],
    txtPoliza: [{ value: '', disabled: true }],
    txtCertificado: [{ value: '', disabled: true }],
    txtNroSolicitudOrigen: [{ value: '', disabled: true }],
    txtProducto: [{ value: '', disabled: true }],
    txtApellidosNombresPaciente: [{ value: '', disabled: true }],
    txtGeneroPaciente: [{ value: '', disabled: true }],
    txtFechaNacimientoPaciente: [{ value: '', disabled: true }],
    txtParentescoPaciente: [{ value: '', disabled: true }],
    txtTipoDocPaciente: [{ value: '', disabled: true }],
    txtNroDocumentoPaciente: [{ value: '', disabled: true }],
    txtEdadPaciente: [{ value: '', disabled: true }],
    txtInicioVigencia: [{ value: '', disabled: true }],
    txtFinVigencia: [{ value: '', disabled: true }],
    txtEstadoCivil: [{ value: '', disabled: true }],
    txtTipoPlanSalud: [{ value: '', disabled: true }],
    txtNroPlan: [{ value: '', disabled: true }],
    txtEstadoPlan: [{ value: '', disabled: true }],
    txtApellidosNombresAfiliado: [{ value: '', disabled: true }],
    txtNroDocumentoAfiliado: [{ value: '', disabled: true }],
    txtGeneroAfiliado: [{ value: '', disabled: true }],
    txtFechaNacimientoAfiliado: [{ value: '', disabled: true }],
    txtApellidosNombresTitular: [{ value: '', disabled: true }],
    txtCodTitular: [{ value: '', disabled: true }],
    txtTipoDocTitular: [{ value: '', disabled: true }],
    txtNumDocumentoTitular: [{ value: '', disabled: true }],
    txtMoneda: [{ value: '', disabled: true }],
    txtNombreContratante: [{ value: '', disabled: true }],
    txtTipoDocContratante: [{ value: '', disabled: true }],
    txtTipoAfiliacion: [{ value: '', disabled: true }],
    txtFechaAfiliacion: [{ value: '', disabled: true }],
    txtNroDocContratante: [{ value: '', disabled: true }]
  });

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.getTipoDocumentosList();
    this.getClienteList();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterOptionClienteByLabel(options: ClienteSiteds[], label: string): ClienteSiteds[] {
    const value = label.trim().toLowerCase();
    return options.filter((option: ClienteSiteds) => {
      return option.nombre.toLowerCase().includes(value);
    });
  }

  filterClientes(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    this.filterOptionsClientes = this.filterOptionClienteByLabel(this.clientes, ds);
  }

  displayLabelCliente(proveedor: ClienteSiteds): string {
    return proveedor && proveedor.nombre ? proveedor.nombre.trim() : '';
  }

  getClienteList() {
    this._clienteService.GetClientesSiteds().subscribe({
      next: (res) => {
        this.clientes = res.resultData;
        for (let option_ of this.clientes) {
          if (option_.id_cliente.trim() == '044') {
            this.valCliente = option_.nombre.trim();
            this.codCliente = (option_.id_cliente).trim();
            this.codFinancimientoCliente = (option_.codigo_financiamiento).trim();
            this.cboCliente.nativeElement.focus();
            break;
          }
        }
      },
      error: console.log,
    });
  }

  selectCliente(option: MatOption) {
    this.codCliente = (option.value.id).trim();
    this.codFinancimientoCliente = (option.value.codigo_financiamiento).trim();
  }

  getTipoDocumentosList() {
    this._tipodocumentoService.GetTipoDocumentosSusalud().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDocumento(target: any) {
    this.valTipoDocumento = target.value;
    this.txtNroDocumento.nativeElement.focus();
  }

  getByDocIdent() {
    this.msgBusqueda = 'Buscando datos... ¡Espere por favor!';
    this._count = 0;
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;
    this.displayedColumnsAsegurados = [];
    this.dataSourceAsegurados = new MatTableDataSource<Afiliado>;
    this.formBuscarPorDatosCompletos.reset();
    if (this.formBuscarPorDocumentoIdentidad.valid && this.codFinancimientoCliente != null) {
      this.statusBtnBuscarPaciente = true;
      this.statusBtnDocIdentidad = true;

      this.showSpinner = true;
      this.requestAsegurado.CodTipoDocumentoAfiliado = this.valTipoDocumento.toString();
      this.requestAsegurado.NumeroDocumentoAfiliado = this.formBuscarPorDocumentoIdentidad.value["txtNroDocumento"]?.toString() || '';
      this.requestAsegurado.RUC = "20251011461";
      this.requestAsegurado.SUNASA = "00023920";
      this.requestAsegurado.IAFAS = this.codFinancimientoCliente;
      this.requestAsegurado.NombresAfiliado = "";
      this.requestAsegurado.ApellidoPaternoAfiliado = "";
      this.requestAsegurado.ApellidoMaternoAfiliado = "";
      this.requestAsegurado.CodEspecialidad = "";

      this._sitedsServices.GetByDni(this.requestAsegurado).subscribe({
        next: (res) => {
          this.showSpinner = false;
          this.statusBtnBuscarPaciente = false;
          this.statusBtnDocIdentidad = false;
          if (res.resultData) {
            this.displayedColumnsAsegurados = ['desProducto', 'apellidoPaternoAfiliado', 'apellidoMaternoAfiliado', 'nombresAfiliado', 'desParentesco', 'nombreContratante', 'desEstado', 'codigoAfiliado', 'fechaNacimiento', 'desGenero', 'desTipoDocumentoAfiliado', 'numeroDocumentoAfiliado'];
            this.dataSourceAsegurados = new MatTableDataSource(res.resultData);
            this.dataSourceAsegurados.sort = this.sort;
            this.dataSourceAsegurados.paginator = this.paginator;
            this._count = this.dataSourceAsegurados.filteredData.length;
            if (this._count == 0) {
              this.msgBusqueda = 'No existe información de búsqueda, intente consultar con otros datos';
            } else {
              this.msgBusqueda = '';
            }
          } else {
            this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
            this.msgBusqueda='¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!';
          }
        },
        error: (e) => {
          console.log;
          this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
          this.msgBusqueda='¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!';
        }
      });
    } else if (this.codFinancimientoCliente == null || this.codCliente == null) {
      this.toastrService.warning('¡Por favor seleccione una aseguradora!');
      this.cboCliente.nativeElement.focus();
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  getByDatosPaciente() {
    this.msgBusqueda = 'Buscando datos... ¡Espere por favor!';
    this._count = 0;
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;
    this.displayedColumnsAsegurados = [];
    this.dataSourceAsegurados = new MatTableDataSource<Afiliado>;
    this.formBuscarPorDocumentoIdentidad.reset();
    if (this.formBuscarPorDatosCompletos.valid && this.codFinancimientoCliente != null) {
      this.statusBtnBuscarPaciente = true;
      this.statusBtnDocIdentidad = true;
      this.showSpinner = true;
      this.requestAsegurado.CodTipoDocumentoAfiliado = "";
      this.requestAsegurado.NumeroDocumentoAfiliado = "";
      this.requestAsegurado.RUC = "20251011461";
      this.requestAsegurado.SUNASA = "00023920";
      this.requestAsegurado.IAFAS = this.codFinancimientoCliente;
      this.requestAsegurado.NombresAfiliado = this.formBuscarPorDatosCompletos.value["txtNombres"]?.toString() || '';
      this.requestAsegurado.ApellidoPaternoAfiliado = this.formBuscarPorDatosCompletos.value["txtApellidoPaterno"]?.toString() || '';
      this.requestAsegurado.ApellidoMaternoAfiliado = this.formBuscarPorDatosCompletos.value["txtApellidoMaterno"]?.toString() || '';
      this.requestAsegurado.CodEspecialidad = "";

      this._sitedsServices.GetByNombresApellidos(this.requestAsegurado).subscribe({
        next: (res) => {
          this.showSpinner = false;
          this.statusBtnBuscarPaciente = false;
          this.statusBtnDocIdentidad = false;
          if (res.resultData) {
            this.displayedColumnsAsegurados = ['desProducto', 'apellidoPaternoAfiliado', 'apellidoMaternoAfiliado', 'nombresAfiliado', 'desParentesco', 'nombreContratante', 'desEstado', 'codigoAfiliado', 'fechaNacimiento', 'desGenero', 'desTipoDocumentoAfiliado', 'numeroDocumentoAfiliado'];
            this.dataSourceAsegurados = new MatTableDataSource(res.resultData);
            this.dataSourceAsegurados.sort = this.sort;
            this.dataSourceAsegurados.paginator = this.paginator;
            this._count = this.dataSourceAsegurados.filteredData.length;
            if (this._count == 0) {
              this.msgBusqueda = 'No existe información de búsqueda, intente consultar con otros datos';
            } else {
              this.msgBusqueda = '';
            }
          } else {
            this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
            this.msgBusqueda='¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!';
          }
        },
        error: (e) => {
          console.log;
          this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
          this.msgBusqueda='¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!';
        }
      });
    } else if (this.codFinancimientoCliente == null || this.codCliente == null) {
      this.toastrService.warning('¡Por favor seleccione una aseguradora!');
      this.cboCliente.nativeElement.focus();
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  getRowSelected(row: Afiliado, position: number) {
    this.positionRow = position;
  }

  getRowSelectedAsegurado(row: Afiliado) {
    this.showSpinner = true;
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;

    this.requestAseguradoCodigo.SUNASA = "00023920";
    this.requestAseguradoCodigo.IAFAS = this.codFinancimientoCliente;
    this.requestAseguradoCodigo.RUC = "20251011461";
    this.requestAseguradoCodigo.CodEspecialidad = "";
    this.requestAseguradoCodigo.NombresAfiliado = row["nombresAfiliado"];
    this.requestAseguradoCodigo.ApellidoPaternoAfiliado = row["apellidoPaternoAfiliado"];
    this.requestAseguradoCodigo.ApellidoMaternoAfiliado = row["apellidoMaternoAfiliado"];
    this.requestAseguradoCodigo.CodigoAfiliado = row["codigoAfiliado"];
    this.requestAseguradoCodigo.CodTipoDocumentoAfiliado = row["codTipoDocumentoAfiliado"];
    this.requestAseguradoCodigo.NumeroDocumentoAfiliado = row["numeroDocumentoAfiliado"];
    this.requestAseguradoCodigo.CodProducto = row["codProducto"];
    this.requestAseguradoCodigo.DesProducto = row["desProducto"];
    this.requestAseguradoCodigo.NumeroPlan = row["numeroPlan"];
    this.requestAseguradoCodigo.CodTipoDocumentoContratante = row["codTipoDocumentoContratante"];
    this.requestAseguradoCodigo.NumeroDocumentoContratante = row["numeroDocumentoContratante"];
    this.requestAseguradoCodigo.NombreContratante = row["nombreContratante"];
    this.requestAseguradoCodigo.CodParentesco = row["codParentesco"];
    this.requestAseguradoCodigo.TipoCalificadorContratante = row["tipoCalificadorContratante"];

    this._sitedsServices.GetByCodigo(this.requestAseguradoCodigo).subscribe({
      next: (res) => {
        this.showSpinner = false;
        if (res.resultData) {
          this.tabDatosAsegurado = false;
          this.afiliado = res.resultData;
          this.tabActivo = 1;

          this.formDatosCompletosAsegurado.controls['txtCodAsegurado'].setValue(res.resultData.datosAfiliado.codigoAfiliado);
          this.formDatosCompletosAsegurado.controls['txtPoliza'].setValue(res.resultData.datosAfiliado.numeroPoliza);
          this.formDatosCompletosAsegurado.controls['txtCertificado'].setValue(res.resultData.datosAfiliado.numeroCertificado);
          this.formDatosCompletosAsegurado.controls['txtProducto'].setValue(res.resultData.datosAfiliado.desProducto);

          this.formDatosCompletosAsegurado.controls['txtApellidosNombresPaciente'].setValue(res.resultData.datosAfiliado.apellidoPaternoAfiliado + ' ' + res.resultData.datosAfiliado.apellidoMaternoAfiliado + ' ' + res.resultData.datosAfiliado.nombresAfiliado);
          this.formDatosCompletosAsegurado.controls['txtGeneroPaciente'].setValue(res.resultData.datosAfiliado.desGenero);
          this.formDatosCompletosAsegurado.controls['txtFechaNacimientoPaciente'].setValue(res.resultData.datosAfiliado.fechaNacimiento);
          this.formDatosCompletosAsegurado.controls['txtParentescoPaciente'].setValue(res.resultData.datosAfiliado.desParentesco);
          this.formDatosCompletosAsegurado.controls['txtTipoDocPaciente'].setValue(res.resultData.datosAfiliado.desTipoDocumentoAfiliado);
          this.formDatosCompletosAsegurado.controls['txtNroDocumentoPaciente'].setValue(res.resultData.datosAfiliado.numeroDocumentoAfiliado);
          this.formDatosCompletosAsegurado.controls['txtEdadPaciente'].setValue(res.resultData.datosAfiliado.edad);
          this.formDatosCompletosAsegurado.controls['txtInicioVigencia'].setValue(res.resultData.datosAfiliado.fechaInicioVigencia);
          this.formDatosCompletosAsegurado.controls['txtFinVigencia'].setValue(res.resultData.datosAfiliado.fechaFinVigencia
          );
          this.formDatosCompletosAsegurado.controls['txtEstadoCivil'].setValue(res.resultData.datosAfiliado.desEstadoCivil);
          this.formDatosCompletosAsegurado.controls['txtTipoPlanSalud'].setValue(res.resultData.datosAfiliado.desTipoPlan);
          this.formDatosCompletosAsegurado.controls['txtNroPlan'].setValue(res.resultData.datosAfiliado.numeroPlan);
          this.formDatosCompletosAsegurado.controls['txtEstadoPlan'].setValue(res.resultData.datosAfiliado.desEstado);

          this.formDatosCompletosAsegurado.controls['txtApellidosNombresAfiliado'].setValue(res.resultData.datosAfiliado);
          this.formDatosCompletosAsegurado.controls['txtNroDocumentoAfiliado'].setValue(res.resultData.datosAfiliado);
          this.formDatosCompletosAsegurado.controls['txtGeneroAfiliado'].setValue(res.resultData.datosAfiliado);
          this.formDatosCompletosAsegurado.controls['txtFechaNacimientoAfiliado'].setValue(res.resultData.datosAfiliado);

          this.formDatosCompletosAsegurado.controls['txtApellidosNombresTitular'].setValue(res.resultData.datosAfiliado.apellidoPaternoTitular + ' ' + res.resultData.datosAfiliado.apellidoMaternoTitular + ' ' + res.resultData.datosAfiliado.nombresTitular);
          this.formDatosCompletosAsegurado.controls['txtCodTitular'].setValue(res.resultData.datosAfiliado.codigoTitular);
          this.formDatosCompletosAsegurado.controls['txtTipoDocTitular'].setValue(res.resultData.datosAfiliado.desTipoDocumentoTitular);
          this.formDatosCompletosAsegurado.controls['txtNumDocumentoTitular'].setValue(res.resultData.datosAfiliado.numeroDocumentoTitular);
          this.formDatosCompletosAsegurado.controls['txtMoneda'].setValue(res.resultData.datosAfiliado.desMoneda);
          this.formDatosCompletosAsegurado.controls['txtNombreContratante'].setValue(res.resultData.datosAfiliado.nombreContratante);
          this.formDatosCompletosAsegurado.controls['txtTipoDocContratante'].setValue(res.resultData.datosAfiliado.desTipoDocumentoContratante);
          this.formDatosCompletosAsegurado.controls['txtTipoAfiliacion'].setValue(res.resultData.datosAfiliado.desTipoAfiliacion);
          this.formDatosCompletosAsegurado.controls['txtFechaAfiliacion'].setValue(res.resultData.datosAfiliado.fechaAfiliacion);
          this.formDatosCompletosAsegurado.controls['txtNroDocContratante'].setValue(res.resultData.datosAfiliado.numeroDocumentoContratante);

          this.displayedColumnsBeneficios = ['codigoCobertura', 'beneficios', 'restricciones', 'desCopagoFijo', 'desCopagoVariable', 'fechaFinCarencia', 'condicionesEspeciales', 'observaciones'];
          this.dataSourceBeneficios = new MatTableDataSource(res.resultData.coberturas);
          this.dataSourceBeneficios.sort = this.sort;
          this.dataSourceBeneficios.paginator = this.paginator;
        } else {
          this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
        }
      },
      error: (e) => {
        console.log;
        this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
      }
    });
  }

  generarAutorizacion() {
    if (this.rowSeleccionado != null) {
      this.showSpinner = true;
      let row = this.rowSeleccionado;
      this.statusBtnGenerarAutorizacion = true;

      this.requestNumeroAutorizacion.ApellidoMaternoAfiliado = this.requestAseguradoCodigo.ApellidoMaternoAfiliado;
      this.requestNumeroAutorizacion.ApellidoMaternoTitular = this.afiliado.datosAfiliado.apellidoMaternoTitular;
      this.requestNumeroAutorizacion.ApellidoPaternoAfiliado = this.requestAseguradoCodigo.ApellidoPaternoAfiliado;
      this.requestNumeroAutorizacion.ApellidoPaternoTitular = this.afiliado.datosAfiliado.apellidoPaternoTitular;
      this.requestNumeroAutorizacion.BeneficioMaximoInicial = row["beneficioMaximoInicial"];
      this.requestNumeroAutorizacion.CodCalificacionServicio = row["codCalificacionServicio"];
      this.requestNumeroAutorizacion.CodCopagoFijo = row["codCopagoFijo"];
      this.requestNumeroAutorizacion.CodCopagoVariable = row["codCopagoVariable"];
      this.requestNumeroAutorizacion.CodEspecialidad = this.requestAseguradoCodigo.CodEspecialidad;
      this.requestNumeroAutorizacion.CodEstado = this.afiliado.datosAfiliado.codEstado;
      this.requestNumeroAutorizacion.CodEstadoMarital = this.afiliado.datosAfiliado.codEstadoCivil;
      this.requestNumeroAutorizacion.CodFechaAfiliacion = this.afiliado.datosAfiliado.codFechaAfiliacion;
      this.requestNumeroAutorizacion.CodFechaFinCarencia = row["codFechaFinCarencia"];
      this.requestNumeroAutorizacion.CodFechaInicioVigencia = this.afiliado.datosAfiliado.codFechaInicioVigencia;
      this.requestNumeroAutorizacion.CodFechaNacimiento = this.afiliado.datosAfiliado.codFechaNacimiento;
      this.requestNumeroAutorizacion.CodGenero = this.afiliado.datosAfiliado.codGenero;
      this.requestNumeroAutorizacion.CodIndicadorRestriccion = row["codIndicadorRestriccion"];
      this.requestNumeroAutorizacion.CodMoneda = row["codTipoMoneda"];
      this.requestNumeroAutorizacion.CodParentesco = this.requestAseguradoCodigo.CodParentesco;
      this.requestNumeroAutorizacion.CodProducto = this.requestAseguradoCodigo.CodProducto;
      this.requestNumeroAutorizacion.CodSubTipoCobertura = row["codigoSubTipoCobertura"];
      this.requestNumeroAutorizacion.CodTipoAfiliacion = this.afiliado.datosAfiliado.codTipoAfiliacion;
      this.requestNumeroAutorizacion.CodTipoCobertura = row["codigoTipoCobertura"];
      this.requestNumeroAutorizacion.CodTipoDocumentoAfiliado = this.requestAseguradoCodigo.CodTipoDocumentoAfiliado;
      this.requestNumeroAutorizacion.CodTipoDocumentoContratante = this.requestAseguradoCodigo.CodTipoDocumentoContratante;
      this.requestNumeroAutorizacion.CodTipoDocumentoTitular = this.afiliado.datosAfiliado.codTipoDocumentoTitular;
      this.requestNumeroAutorizacion.CodTipoPlan = this.afiliado.datosAfiliado.codTipoPlan;
      this.requestNumeroAutorizacion.CodigoAfiliado = this.requestAseguradoCodigo.CodigoAfiliado;
      this.requestNumeroAutorizacion.CodigoTitular = this.afiliado.datosAfiliado.codigoTitular;
      this.requestNumeroAutorizacion.CondicionesEspeciales = row["condicionesEspeciales"];
      this.requestNumeroAutorizacion.DesProducto = this.requestAseguradoCodigo.DesProducto;
      this.requestNumeroAutorizacion.IAFAS = this.requestAseguradoCodigo.IAFAS;
      this.requestNumeroAutorizacion.NombreContratante = this.requestAseguradoCodigo.NombreContratante;
      this.requestNumeroAutorizacion.NombresAfiliado = this.requestAseguradoCodigo.NombresAfiliado;
      this.requestNumeroAutorizacion.NombresTitular = this.afiliado.datosAfiliado.nombresTitular;
      this.requestNumeroAutorizacion.NumeroCertificado = this.afiliado.datosAfiliado.numeroCertificado;
      this.requestNumeroAutorizacion.NumeroContrato = this.afiliado.datosAfiliado.numeroContrato;
      this.requestNumeroAutorizacion.NumeroDocumentoAfiliado = this.requestAseguradoCodigo.NumeroDocumentoAfiliado;
      this.requestNumeroAutorizacion.NumeroDocumentoContratante = this.requestAseguradoCodigo.NumeroDocumentoContratante;
      this.requestNumeroAutorizacion.NumeroDocumentoTitular = this.afiliado.datosAfiliado.numeroDocumentoTitular;
      this.requestNumeroAutorizacion.NumeroPlan = this.requestAseguradoCodigo.NumeroPlan;
      this.requestNumeroAutorizacion.NumeroPoliza = this.afiliado.datosAfiliado.numeroPoliza;
      this.requestNumeroAutorizacion.RUC = this.requestAseguradoCodigo.RUC;
      this.requestNumeroAutorizacion.SUNASA = this.requestAseguradoCodigo.SUNASA;
      this.vFecha1 = this.afiliado.datosAfiliado.codFechaAfiliacion
      this.vCodFechaFinCarencia = row["codFechaFinCarencia"];
      this.vFecha2 = this.vCodFechaFinCarencia;
      this.vCodmoneda = row["codTipoMoneda"];

      this._sitedsServices.GetNumeroAutorizacion(this.requestNumeroAutorizacion).subscribe({
        next: (res) => {
          this.showSpinner = false;
          if (res.resultData) {
            this.statusBtnVerDocAutorizacion = false;
            this.formDatosCompletosAsegurado.controls['txtNroAutorizacion'].setValue(res.resultData.numeroAutorizacion);
            this.numeroAutorizacion = res.resultData.numeroAutorizacion;
            this.base64_pdf = res.resultData.documento;
            this.toastrService.success('Se generó el código de autorización N°: ' + this.numeroAutorizacion);
          } else {
            this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la generación del código!');
          }
        },
        error: (e) => {
          console.log;
          this.toastrService.warning('¡Sucedió algo inesperado de manera interna, por favor reintente la búsqueda!');
        }
      });
    } else {
      this.toastrService.warning('¡Por favor seleccione un beneficio!');
    }
  }

  verDocumentoAutorizacion() {
    if (this.base64_pdf != '') {
      this.descargarPdf(this.base64_pdf);
    } else {
      this.toastrService.warning('¡Por favor genere un código de autorización!');
    }
  }

  getRowSelectedBeneficio(row: Afiliado, position: number) {
    this.positionRow2 = position;
    this.rowSeleccionado = row;
    this.statusBtnGenerarAutorizacion = false;
    this.statusBtnVerDocAutorizacion = true;
  }

  descargarPdf(base64: string) {
    const byteArray = new Uint8Array(
      atob(base64)
        .split("")
        .map(char => char.charCodeAt(0))
    );
    const file = new Blob([byteArray], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    let pdfName = "Siteds_" + this.numeroAutorizacion + ".pdf";

    const nav = (window.navigator as any);

    if (window.navigator && nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(file, pdfName);
    } else {
      //window.open(fileURL);

      // Construct the 'a' element
      let link = document.createElement("a");
      link.download = pdfName;
      link.target = "_blank";

      // Construct the URI
      link.href = fileURL;
      document.body.appendChild(link);
      link.click();

      // Cleanup the DOM
      document.body.removeChild(link);
    }
  }

  exitRegistrarSiteds() {
    this._dialogRef.close(true);
  }

  saveSiteds() {
    if (this.formDatosCompletosAsegurado) {
      this.siteds.id_historia = parseInt('0');
      this.siteds.documentoautorizacion = this.formDatosCompletosAsegurado.value["txtNroAutorizacion"]?.toString() || ''; // CAMPO X REVIZAR
      this.siteds.codigoafiliado = this.afiliado.datosAfiliado.codigoAfiliado;
      this.siteds.numeropoliza = this.afiliado.datosAfiliado.numeroPoliza;
      this.siteds.numerocontrato = this.afiliado.datosAfiliado.numeroContrato;
      this.siteds.numerocertificado = this.afiliado.datosAfiliado.numeroCertificado;
      this.siteds.codproducto = this.afiliado.datosAfiliado.codProducto;
      this.siteds.desproducto = this.formDatosCompletosAsegurado.value["txtProducto"]?.toString() || '';
      this.siteds.apellidopaternoafiliado = this.afiliado.datosAfiliado.apellidoPaternoTitular;
      this.siteds.apellidomaternoafiliado = this.afiliado.datosAfiliado.apellidoMaternoTitular;
      this.siteds.nombresafiliado = this.afiliado.datosAfiliado.nombresTitular;
      this.siteds.codgenero = this.afiliado.datosAfiliado.codGenero;
      this.siteds.desgenero = this.formDatosCompletosAsegurado.value["txtGeneroPaciente"]?.toString() || '';
      this.vFecha1 = this.afiliado.datosAfiliado.codFechaAfiliacion
      this.siteds.codfechanacimiento = this.afiliado.datosAfiliado.codFechaNacimiento;
      this.siteds.codfechafincarencia = this.vFecha2;
      this.siteds.codparentesco = this.requestAseguradoCodigo.CodParentesco;;
      this.siteds.desparentesco = this.formDatosCompletosAsegurado.value["txtParentescoPaciente"]?.toString() || '';
      this.siteds.codtipodocumentoafiliado = this.afiliado.datosAfiliado.codTipoDocumentoAfiliado;
      this.siteds.destipodocumentoafiliado = this.formDatosCompletosAsegurado.value["txtTipoDocPaciente"]?.toString() || '';
      this.siteds.numerodocumentoafiliado = this.formDatosCompletosAsegurado.value["txtNroDocumentoPaciente"]?.toString() || '';
      this.siteds.edad = this.formDatosCompletosAsegurado.value["txtEdadPaciente"]?.toString() || '';
      this.siteds.codfechainiciovigencia = this.afiliado.datosAfiliado.codFechaInicioVigencia;
      this.siteds.codfechanacimiento = this.afiliado.datosAfiliado.codFechaNacimiento;
      this.siteds.fechanacimiento = this.afiliado.datosAfiliado.fechaNacimiento;
      this.siteds.fechainiciovigencia = this.afiliado.datosAfiliado.fechaInicioVigencia;
      this.siteds.codfechafinvigencia = this.afiliado.datosAfiliado.codFechaFinVigencia;
      this.siteds.fechafinvigencia = this.afiliado.datosAfiliado.fechaFinVigencia;
      this.siteds.codestadocivil = this.afiliado.datosAfiliado.codEstadoCivil;
      this.siteds.desestadocivil = this.formDatosCompletosAsegurado.value["txtEstadoCivil"]?.toString() || '';
      this.siteds.codtipoplan = parseInt(this.afiliado.datosAfiliado.codTipoPlan);
      this.siteds.destipoplan = this.formDatosCompletosAsegurado.value["txtTipoPlanSalud"]?.toString() || '';
      this.siteds.numeroplan = this.formDatosCompletosAsegurado.value["txtNroPlan"]?.toString() || '';
      this.siteds.codestado = this.afiliado.datosAfiliado.codEstado;
      this.siteds.desestado = this.formDatosCompletosAsegurado.value["txtEstadoPlan"]?.toString() || '';
      this.siteds.codfechaactualizacionfoto = this.afiliado.datosAfiliado.codFechaActualizacionFoto;
      this.siteds.fechaactualizacionfoto = this.afiliado.datosAfiliado.fechaActualizacionFoto;
      this.siteds.apellidopaternotitular = this.formDatosCompletosAsegurado.value["txtApellidosPaternoTitular"]?.toString() || '';
      this.siteds.apellidomaternotitular = this.formDatosCompletosAsegurado.value["txtApellidosMaternoTitular"]?.toString() || '';
      this.siteds.nombrestitular = this.formDatosCompletosAsegurado.value["txtApellidosNombresTitular"]?.toString() || '';
      this.siteds.codigotitular = this.afiliado.datosAfiliado.codigoTitular;
      this.siteds.codtipodocumentotitular = this.afiliado.datosAfiliado.codTipoDocumentoTitular;
      this.siteds.destipodocumentotitular = this.formDatosCompletosAsegurado.value["txtTipoDocTitular"]?.toString() || '';
      this.siteds.numerodocumentotitular = this.formDatosCompletosAsegurado.value["txtNumDocumentoTitular"]?.toString() || '';
      this.siteds.codmoneda = parseInt(this.afiliado.datosAfiliado.codMoneda); parseInt(this.vCodmoneda);
      this.siteds.desmoneda = this.formDatosCompletosAsegurado.value["txtMoneda"]?.toString() || '';
      this.siteds.nombrecontratante = this.formDatosCompletosAsegurado.value["txtNombreContratante"]?.toString() || '';
      this.siteds.codtipodocumentocontratante = this.formDatosCompletosAsegurado.value[""]?.toString() || '';
      this.siteds.destipodocumentocontratante = this.formDatosCompletosAsegurado.value["txtTipoDocContratante"]?.toString() || '';
      this.siteds.codtipoafiliacion = this.afiliado.datosAfiliado.codTipoAfiliacion;
      this.siteds.destipoafiliacion = this.formDatosCompletosAsegurado.value["txtTipoAfiliacion"]?.toString() || '';
      this.siteds.codfechaafiliacion = this.afiliado.datosAfiliado.codFechaAfiliacion;
      this.siteds.fechaafiliacion = this.vFecha1;
      this.siteds.numerodocumentocontratante = this.formDatosCompletosAsegurado.value["txtNroDocContratante"]?.toString() || '';
      this.siteds.codigotipocobertura = '';
      this.siteds.codigosubtipocobertura = '';
      this.siteds.codigocobertura = '';
      this.siteds.beneficios = '';
      this.siteds.codindicadorrestriccion = '';
      this.siteds.restricciones = '';
      this.siteds.codcopagofijo = parseInt('0');
      this.siteds.descopagofijo = '';
      this.siteds.codcopagovariable = 0;
      this.siteds.descopagovariable = '';
      this.siteds.codfechafincarencia = this.vFecha1;
      this.siteds.fechafincarencia = this.vFecha1;
      this.siteds.condicionesespeciales = '';
      this.siteds.observaciones = '';
      this.siteds.codcalificacionservicio = '';
      this.siteds.descalificacionservicio = '';
      this.siteds.beneficiomaximoinicial = '';
      this.siteds.numerocobertura = '';
      this.siteds.fecha_creacion_doc_aut = this.vFecha1;
      this.siteds.hora_creacion_doc_aut = new Date();
      this.siteds.descripcion_producto = '';
      this.siteds.usuario_creacion = parseInt('0');
      this.siteds.fecha_creacion = new Date();
      this.siteds.usuario_modificacion = parseInt('0');
      this.siteds.fecha_modificacion = new Date();

      //console.log(this.siteds)
      this._historiaclinicaService.addHistoriaClinicaSiteds(this.siteds).subscribe
        (
          {
            next: (val: any) => {
              this.toastrService.success("Sited se registro correctamente!");
              /*this._dialogRef.close({
                data: this.siteds
              });*/
            },
            error: (err: any) => {
              console.error(err);
            },
          }
        );
    }

    this._dialogRef.close({
      data: { 'datosSiteds': this.requestNumeroAutorizacion, 'datosAsegurado': this.formDatosCompletosAsegurado, 'codAutorizacion': this.numeroAutorizacion, 'codCliente': this.codCliente, 'codFinanciador': this.codFinancimientoCliente }
    });
  }

  atencionSinSiteds() {
    //this._dialogRef.close(true);
    const dialogRef = this._dialog.open(ListadopacientesComponent, {
      panelClass: 'sanna_theme',
      disableClose: true,
      data: { 'servicio': 'Ambulancia' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        let tipoDeServicio = localStorage.getItem('tipoServicio') as string;

        if (tipoDeServicio == 'I') {
          const dialogRefAte = this._dialog.open(AmbNuevaAtencionComponent, {
            panelClass: 'sanna_theme',
            disableClose: true,
            width: '1100px',
            data: result
          });

          dialogRefAte.afterClosed().subscribe(result => {
            this._dialogRef.close(true);
          });
        } else if (tipoDeServicio == 'P') {
          const dialogRefAte = this._dialog.open(AmbNuevoEventoComponent, {
            panelClass: 'sanna_theme',
            disableClose: true,
            width: '1100px',
            data: result
          });

          dialogRefAte.afterClosed().subscribe(result => {
            this._dialogRef.close(true);
          });
        } else if (tipoDeServicio == 'OM') {
          const dialogRefAte = this._dialog.open(AmbNuevaOrientacionMedicaComponent, {
            panelClass: 'sanna_theme',
            disableClose: true,
            width: '450px',
            data: result
          });

          dialogRefAte.afterClosed().subscribe(result => {
            this._dialogRef.close(true);
          });
        }
      } else {
        this.toastrService.warning('¡Por favor seleccione un paciente!');
      }
    });
  }

  close() {
    this._dialogRef.close(true);
  }

  soloNumeros(event: Event): boolean {
    return soloNumeros(event);
  }

  soloLetras(event: Event): boolean {
    return soloLetras(event);
  }

  limpiarNumero(event: Event): boolean {
    return limpiarNumero(event);
  }

  limpiarLetras(event: Event): boolean {
    return limpiarLetras(event);
  }

  rellenaCaracteres(event: Event): boolean {
    return rellenaCaracteres(event);
  }

}