import { OnInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { Afiliado, Coberturas, Request_AsegCod_Obs_DatAdic_CondMed, Request_Asegurado, Request_NumeroAutorizacion, Response_Siteds } from 'src/app/models/siteds.model';
import { SitedsService } from 'src/app/services/siteds.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-siteds',
  templateUrl: './siteds.component.html',
  styleUrl: './siteds.component.scss'
})

export class SitedsComponent implements OnInit {
  usuarioEnlinea: UsuarioAuth;
  tipoDocumentos: TipoDocumento[];
  rowSeleccionado: any;
  base64_pdf: string;
  numeroAutorizacion: string;
  displayedColumnsAsegurados: string[] = [];
  displayedColumnsBeneficios: string[] = [];
  dataSourceAsegurados!: MatTableDataSource<Afiliado>;
  dataSourceBeneficios!: MatTableDataSource<Coberturas>;
  requestAsegurado: Request_Asegurado = {} as Request_Asegurado;
  requestAseguradoCodigo: Request_AsegCod_Obs_DatAdic_CondMed = {} as Request_AsegCod_Obs_DatAdic_CondMed;
  requestNumeroAutorizacion: Request_NumeroAutorizacion = {} as Request_NumeroAutorizacion;
  afiliado: Response_Siteds;
  showSpinner = false;
  statusBtnBuscarPaciente = false;
  statusBtnDocIdentidad = false;
  statusBtnObservaciones = true;
  statusBtnGenerarAutorizacion = true;
  statusBtnVerDocAutorizacion = true;
  valTipoDocumento = 0;
  tabDatosAsegurado = true;
  tabActivo = 0;

  constructor(private _liveAnnouncer: LiveAnnouncer, private toastrService: ToastrService, private frm: FormBuilder, private _tipoDocumentoService: TipoDocumentoService, private _sitedsServices: SitedsService) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  formBuscarPorDocumentoIdentidad = this.frm.group({
    cboTipoDocumento: [{ value: '', disabled: false }, Validators.required],
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
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTipoDocumentosList() {
    this._tipoDocumentoService.GetTipoDocumentosSusalud().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDocumento(target: any) {
    this.valTipoDocumento = target.value;
  }

  getByDocIdent() {
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;
    this.displayedColumnsAsegurados = [];
    this.dataSourceAsegurados = new MatTableDataSource<Afiliado>;
    this.formBuscarPorDatosCompletos.reset();
    if (this.formBuscarPorDocumentoIdentidad.valid) {
      this.statusBtnBuscarPaciente = true;
      this.statusBtnDocIdentidad = true;

      this.showSpinner = true;
      this.requestAsegurado.CodTipoDocumentoAfiliado = this.valTipoDocumento.toString();
      this.requestAsegurado.NumeroDocumentoAfiliado = this.formBuscarPorDocumentoIdentidad.value["txtNroDocumento"]?.toString() || '';
      this.requestAsegurado.RUC = "20251011461";
      this.requestAsegurado.SUNASA = "00023920";
      this.requestAsegurado.IAFAS = "20002";
      this.requestAsegurado.NombresAfiliado = "";
      this.requestAsegurado.ApellidoPaternoAfiliado = "";
      this.requestAsegurado.ApellidoMaternoAfiliado = "";
      this.requestAsegurado.CodEspecialidad = "";

      this._sitedsServices.GetByDni(this.requestAsegurado).subscribe({
        next: (res) => {
          this.displayedColumnsAsegurados = ['desProducto', 'apellidoPaternoAfiliado', 'apellidoMaternoAfiliado', 'nombresAfiliado', 'desParentesco', 'nombreContratante', 'desEstado', 'codigoAfiliado', 'fechaNacimiento', 'desGenero', 'desTipoDocumentoAfiliado', 'numeroDocumentoAfiliado'];
          this.dataSourceAsegurados = new MatTableDataSource(res.resultData);
          this.dataSourceAsegurados.sort = this.sort;
          this.dataSourceAsegurados.paginator = this.paginator;
          this.showSpinner = false;
          this.statusBtnBuscarPaciente = false;
          this.statusBtnDocIdentidad = false;
        },
        error: console.log,
      });
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  getByDatosPaciente() {
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;
    this.displayedColumnsAsegurados = [];
    this.dataSourceAsegurados = new MatTableDataSource<Afiliado>;
    this.formBuscarPorDocumentoIdentidad.reset();
    if (this.formBuscarPorDatosCompletos.valid) {
      this.statusBtnBuscarPaciente = true;
      this.statusBtnDocIdentidad = true;
      this.showSpinner = true;
      this.requestAsegurado.CodTipoDocumentoAfiliado = "";
      this.requestAsegurado.NumeroDocumentoAfiliado = "";
      this.requestAsegurado.RUC = "20251011461";
      this.requestAsegurado.SUNASA = "00023920";
      this.requestAsegurado.IAFAS = "20002";
      this.requestAsegurado.NombresAfiliado = this.formBuscarPorDatosCompletos.value["txtNombres"]?.toString() || '';
      this.requestAsegurado.ApellidoPaternoAfiliado = this.formBuscarPorDatosCompletos.value["txtApellidoPaterno"]?.toString() || '';
      this.requestAsegurado.ApellidoMaternoAfiliado = this.formBuscarPorDatosCompletos.value["txtApellidoMaterno"]?.toString() || '';
      this.requestAsegurado.CodEspecialidad = "";

      this._sitedsServices.GetByNombresApellidos(this.requestAsegurado).subscribe({
        next: (res) => {
          console.log(res.resultData)
          this.displayedColumnsAsegurados = ['desProducto', 'apellidoPaternoAfiliado', 'apellidoMaternoAfiliado', 'nombresAfiliado', 'desParentesco', 'nombreContratante', 'desEstado', 'codigoAfiliado', 'fechaNacimiento', 'desGenero', 'desTipoDocumentoAfiliado', 'numeroDocumentoAfiliado'];
          this.dataSourceAsegurados = new MatTableDataSource(res.resultData);
          this.dataSourceAsegurados.sort = this.sort;
          this.dataSourceAsegurados.paginator = this.paginator;
          this.showSpinner = false;
          this.statusBtnBuscarPaciente = false;
          this.statusBtnDocIdentidad = false;
        },
        error: console.log,
      });
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  getRowSelectedAsegurado(row: Afiliado) {
    this.showSpinner = true;
    this.tabDatosAsegurado = true;
    this.tabActivo = 0;

    this.requestAseguradoCodigo.SUNASA = "00023920";
    this.requestAseguradoCodigo.IAFAS = "20002";
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
        this.tabDatosAsegurado = false;
        this.showSpinner = false;
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
      },
      error: console.log,
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

      this._sitedsServices.GetNumeroAutorizacion(this.requestNumeroAutorizacion).subscribe({
        next: (res) => {
          this.showSpinner = false;
          this.statusBtnVerDocAutorizacion = false;
          this.formDatosCompletosAsegurado.controls['txtNroAutorizacion'].setValue(res.resultData.numeroAutorizacion);
          this.numeroAutorizacion = res.resultData.numeroAutorizacion;
          this.base64_pdf = res.resultData.documento;
          this.toastrService.success('Se generó el código de autorización N°: ' + this.numeroAutorizacion);
        },
        error: console.log,
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

  getRowSelectedBeneficio(row: Afiliado) {
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
}