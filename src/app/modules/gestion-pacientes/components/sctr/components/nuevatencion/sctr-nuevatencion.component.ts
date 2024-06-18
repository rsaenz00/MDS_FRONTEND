import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MotivoService } from 'src/app/services/motivo.services';
import { Motivo } from 'src/app/models/motivo.model';
import { ParametroService } from 'src/app/services/parametro.service';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/models/plan.model';
import { Parametro } from 'src/app/models/parametro.model';
import { SctrMantenimientoclinicaComponent } from '../mantenimientoclinica/sctr-mantenimientoclinica.component';
import { TipoDocumentoService } from 'src/app/services/tipodocumento.service';
import { TipoDocumento } from 'src/app/models/tipodocumento.model';
import { ListadoclinicasComponent } from '../listadoclinicas/listadoclinicas.component';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { AtencionService } from 'src/app/services/atencion.service';
import { ToastrService } from 'ngx-toastr';
import { Atencion } from 'src/app/models/atencion.model';
import { MatOption } from '@angular/material/core';
import { ListadopacientesComponent } from '../listadopacientes/listadopacientes.component';
import { UsuarioAuth } from 'src/app/models/usuario-auth';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { RegistraclienteComponent } from '../registracliente/registracliente.component';
import { PacienteService } from 'src/app/services/paciente.service';
import { ClinicaService } from 'src/app/services/clinica.service';

var cboMotivoValidacion = 0, paseAtencion = 0, codCliente = 0;

@Component({
  selector: 'app-sctr-nuevatencion',
  templateUrl: './sctr-nuevatencion.component.html',
  styleUrl: './sctr-nuevatencion.component.scss'
})

export class SctrNuevatencionComponent {
  usuarioEnlinea: UsuarioAuth;
  cboMotivo: any;
  rdSkill: any;
  tipoAtencion: number;
  codAtencionEditar: number = 0;
  codClinica: number;
  codClinicaPrimeraAtencion: number;
  codPaciente: number;
  valSexo = 0;
  valTipoDocumento = 0;
  valMetodoValidacion = 0;
  valPlan = 0;
  valMotivo = 0;
  valRuc: string;
  estadoClinica: string;
  tituloFormulario: string;
  _1raAtencion: boolean = false;
  _2daAtencion: boolean = false;
  _SiPaseAtencion: boolean = false;
  _NoPaseAtencion: boolean = false;
  _SiHojaAtencion: boolean = false;
  _NoHojaAtencion: boolean = false;
  showSpinner = true;

  constructor(private _dialog: MatDialog, private _motivoService: MotivoService, private _parametroService: ParametroService, private _planServices: PlanService, private _atencionServices: AtencionService, private _personaServices: PersonaService, private _clienteService: ClienteService, private frm: FormBuilder, private toastrService: ToastrService, private _tipoDocumentoService: TipoDocumentoService, public _dialogRef: MatDialogRef<SctrNuevatencionComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private _pacientesServices: PacienteService, private _clinicasServices: ClinicaService) {
    this.cboMotivo = data.cboMotivo;
    this.rdSkill = data.rdSkill;
    this.codAtencionEditar = data.codAtencionEditar;
  }

  formularioNuevoPacienteSctr = this.frm.group({
    txtApePaterno: [{ value: '', disabled: true }, Validators.required],
    txtApeMaterno: [{ value: '', disabled: true }, Validators.required],
    txtNombres: [{ value: '', disabled: true }, Validators.required],
    txtNroDocumento: [{ value: '', disabled: true }, Validators.required],
    txtFechaNacimiento: [{ value: '', disabled: true }, Validators.required],
    cboSexo: [{ value: '', disabled: true }, Validators.required],
    cboTipoDocumento: [{ value: '', disabled: true }, Validators.required],
    txtCelular: [{ value: '', disabled: true }, Validators.required]
  });

  formularioNuevaAtencionSctr = this.frm.group({
    txtNroAtencion: [{ value: '', disabled: true }],
    txtClinica: [{ value: '', disabled: true }, Validators.required],
    txtDireccion: [{ value: '', disabled: true }, Validators.required],
    txtTelefono: [{ value: '', disabled: true }, Validators.required],
    txtAnexo: [{ value: '', disabled: true }, Validators.required],
    txtPersonaReporta: ['', Validators.required],
    txtRuc: ['', Validators.required],
    txtEmpresa: ['', Validators.required],
    txtAseguradora: [{ value: "PACIFICO S.A. ENT. PRESTADORA DE SALUD", disabled: true }],
    /*txtLugarAccidente: [{ value: '', disabled: true }],
    txtPuestoCargo: [{ value: '', disabled: true }],
    txtInicioLabores: [{ value: '', disabled: true }],
    txtTerminoLabores: [{ value: '', disabled: true }],
    txtFechaAccidente: [{ value: '', disabled: true }],
    txtHoraAccidente: [{ value: '', disabled: true }],
    txtRelatoAccidente: [{ value: '', disabled: true }],*/
    rbHojaAtencion: ['', Validators.required],
    cboMetodoValidacion: ['', Validators.required],
    cboPlan: [{ value: '', disabled: true }, Validators.required],
    rbPaseAtencion: ['', Validators.required],
    cboMotivo: [{ value: '', disabled: true }],
    txtObservacion: [''],
    txtClinicaPrimeraAtencion: [{ value: '', disabled: true }]
  });

  motivos: Motivo[];
  planes: Plan[];
  validaciones: Parametro[];
  sexos: Parametro[];
  tipoDocumentos: TipoDocumento[];
  filtradoClientes: Cliente[];
  atencion: Atencion = {} as Atencion;
  persona: Persona = {} as Persona;
  fechaNacimiento: any;
  statusBtnClinicaPrimAtencion = false;
  statusBtnLugarAccidente = true;
  statusBtnFiltrarPaciente = false;
  statusBtnNuevoPaciente = false;
  statusBtnRegistrarAseguradora = false;
  statusBtnGuardarPaciente = true;

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    //console.log(this.cboMotivo + " - " + this.rdSkill);
    this.getMetodosValidacionList();
    this.getPlanesList();
    this.getSexosList();
    this.getTipoDocumentosList();

    if (this.codAtencionEditar == 0 || this.codAtencionEditar == null) {
      this.tituloFormulario = "Creación de atención SCTR";
      this.showSpinner = false;
    } else {
      this.tituloFormulario = "Modificación de atención SCTR";
      this.precargarPaciente(this.codAtencionEditar);
    }
  }

  precargarPaciente(codAtencion: number) {
    this._atencionServices.GetAtencionSctrByCodigo(codAtencion.toString()).subscribe({
      next: (resAtencion) => {
        console.log(resAtencion.resultData[0]);

        //CLINICA
        this._clinicasServices.GetClinicasFiltro(resAtencion.resultData[0].id_clinica, 'Codigo').subscribe({
          next: (resClinica) => {
            //console.log(resClinica.resultData);
            this.codClinica = resClinica.resultData[0].id_clinica;
            this.formularioNuevaAtencionSctr.controls['txtClinica'].setValue(resClinica.resultData[0].clinica);
            this.formularioNuevaAtencionSctr.controls['txtDireccion'].setValue(resClinica.resultData[0].direccion);
            this.formularioNuevaAtencionSctr.controls['txtTelefono'].setValue(resClinica.resultData[0].telefono);
            this.formularioNuevaAtencionSctr.controls['txtAnexo'].setValue(resClinica.resultData[0].anexo);
            if (resClinica.resultData[0].afiliado == "1") {
              this.estadoClinica = "CLINICA AFILIADA";
              this.formularioNuevaAtencionSctr.controls['cboMetodoValidacion'].enable();
              //this.formularioNuevaAtencionSctr.controls['cboPlan'].enable();
              this.formularioNuevaAtencionSctr.controls['txtRuc'].enable();
              this.formularioNuevaAtencionSctr.controls['txtEmpresa'].enable();
              this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].enable();
              this.statusBtnRegistrarAseguradora = false;
            } else {
              this.estadoClinica = "CLINICA NO AFILIADA";
              this.formularioNuevaAtencionSctr.controls['cboMetodoValidacion'].disable();
              //this.formularioNuevaAtencionSctr.controls['cboPlan'].disable();
              this.formularioNuevaAtencionSctr.controls['txtRuc'].disable();
              this.formularioNuevaAtencionSctr.controls['txtEmpresa'].disable();
              this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].disable();
              this.statusBtnRegistrarAseguradora = true;
            }
          },
          error: console.log,
        });
        //FIN CLINICA

        //PACIENTE         
        this._pacientesServices.GetPacientesFiltro(resAtencion.resultData[0].numero_documento_id, 'ApePaternoDni').subscribe({
          next: (resPaciente) => {
            //console.log(resPaciente.resultData[0])
            this.codPaciente = resPaciente.resultData[0].id_paciente;
            this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].setValue(resPaciente.resultData[0].numero_documento);
            this.formularioNuevoPacienteSctr.controls['txtApePaterno'].setValue(resPaciente.resultData[0].apellido_paterno);
            this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].setValue(resPaciente.resultData[0].apellido_materno);
            this.formularioNuevoPacienteSctr.controls['txtNombres'].setValue(resPaciente.resultData[0].nombres);
            this.formularioNuevoPacienteSctr.controls['txtCelular'].setValue(resPaciente.resultData[0].movil);
            this.fechaNacimiento = new Date(resPaciente.resultData[0].fecha_nacimiento);

            if (resPaciente.resultData[0].sexo == "M") {
              this.valSexo = 1;
            } else {
              this.valSexo = 2;
            }

            this.valTipoDocumento = resPaciente.resultData[0].fecha_nacimiento;
          },
          error: console.log,
        });
        //FIN PACIENTE

        //CLIENTE
        this._clienteService.getClienteListByRuc(resAtencion.resultData[0].empresa_ruc).subscribe({
          next: (res) => {
            this.filtradoClientes = res.resultData;
            this.verRuc(res.resultData);
            codCliente = parseInt(resAtencion.resultData[0].id_cliente);
            this.formularioNuevaAtencionSctr.get("txtEmpresa")?.setValue(resAtencion.resultData[0].empresa);
            this.valRuc = resAtencion.resultData[0].empresa_ruc.trim();
            this.formularioNuevaAtencionSctr.controls['txtRuc']?.setValue(resAtencion.resultData[0].empresa_ruc);//POR REVISAR
          },
          error: console.log,
        });
        //FIN CLIENTE

        //ATENCION
        if (resAtencion.resultData.length == 1) {
          this.formularioNuevaAtencionSctr.controls['txtNroAtencion'].setValue(resAtencion.resultData[0].cod_atencion);
          this.formularioNuevaAtencionSctr.controls['txtPersonaReporta'].setValue(resAtencion.resultData[0].persona_reporta);
          this.formularioNuevaAtencionSctr.controls['txtObservacion'].setValue(resAtencion.resultData[0].observacion);
          this.formularioNuevaAtencionSctr.controls['txtClinicaPrimeraAtencion'].setValue(resAtencion.resultData[0].ipress_primera_ate);
          this.rdSkill = resAtencion.resultData[0].skill;
          this.cboMotivo = resAtencion.resultData[0].motivo_skill;
          this.codClinicaPrimeraAtencion = resAtencion.resultData[0].id_clinica_primera_atencion;

          if (resAtencion.resultData[0].numero_atencion == "1") {
            this._1raAtencion = true;
            this._2daAtencion = false;
            this.statusBtnClinicaPrimAtencion = false;
            this.tipoAtencion = 1;
          }
          if (resAtencion.resultData[0].numero_atencion == "2") {
            this._2daAtencion = true;
            this._1raAtencion = false;
            this.statusBtnClinicaPrimAtencion = true;
            this.tipoAtencion = 2;
          }

          if (resAtencion.resultData[0].hoja_atencion == true) {
            this._SiHojaAtencion = true;
            this._NoHojaAtencion = false;
            this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].setValue("1");
          } else {
            this._NoHojaAtencion = true;
            this._SiHojaAtencion = false;
            this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].setValue("0");
          }

          if (resAtencion.resultData[0].id_motivo == null) {
            if (this.tipoAtencion == 1) {
              this._SiPaseAtencion = true;
              this._NoPaseAtencion = false;
              paseAtencion = 2;
              this.formularioNuevaAtencionSctr.controls['rbPaseAtencion'].setValue("2");
            } else {
              this._NoPaseAtencion = true;
              this._SiPaseAtencion = false;
              paseAtencion = 1;
              this.formularioNuevaAtencionSctr.controls['rbPaseAtencion'].setValue("1");
              this.getMotivoList(this.tipoAtencion, paseAtencion);
              this.valMotivo = parseInt(resAtencion.resultData[0].id_motivo);
            }
          } else {
            var estadoMotivo: any = false;

            for (paseAtencion = 1; paseAtencion <= 2; paseAtencion++) {
              this._motivoService.GetMotivosListByTipoAndPase(this.tipoAtencion, paseAtencion).subscribe({
                next: (res) => {
                  this.motivos = res.resultData;
                  for (let option_ of res.resultData) {
                    if (parseInt(resAtencion.resultData[0].id_motivo) == option_.id_motivo) {
                      this.formularioNuevaAtencionSctr.controls['cboMotivo'].enable();
                      this.valMotivo = parseInt(resAtencion.resultData[0].id_motivo);
                      estadoMotivo = true;
                      break;
                    }
                  }
                },
                error: console.log,
              });

              if (estadoMotivo == true) {
                break;
              }
            }

            if (paseAtencion == 1) {
              this._SiPaseAtencion = true;
              this._NoPaseAtencion = false;
              this.formularioNuevaAtencionSctr.controls['rbPaseAtencion'].setValue("1");
            } else {
              this._NoPaseAtencion = true;
              this._SiPaseAtencion = false;
              this.formularioNuevaAtencionSctr.controls['rbPaseAtencion'].setValue("2");
            }

          }

          this.valMetodoValidacion = parseInt(resAtencion.resultData[0].metodo_validacion);
          cboMotivoValidacion = resAtencion.resultData[0].metodo_validacion;
          this.valPlan = resAtencion.resultData[0].id_plan;

          if (this.valPlan == 0) {
            this.formularioNuevaAtencionSctr.controls['cboPlan'].disable();
          } else {
            this.formularioNuevaAtencionSctr.controls['cboPlan'].enable();
          }

          this.showSpinner = false;
        }
        //FIN ATENCION

      },
      error: console.log,
    });
  }

  newPaciente() {
    this.codPaciente = 0;
    this.valSexo = 0;
    this.valTipoDocumento = 0;
    this.formularioNuevoPacienteSctr.controls['cboTipoDocumento'].enable();
    this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].enable();
    this.formularioNuevoPacienteSctr.controls['txtApePaterno'].enable();
    this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].enable();
    this.formularioNuevoPacienteSctr.controls['txtNombres'].enable();
    this.formularioNuevoPacienteSctr.controls['txtCelular'].enable();
    this.formularioNuevoPacienteSctr.controls['txtFechaNacimiento'].enable();
    this.formularioNuevoPacienteSctr.controls['cboSexo'].enable();
    this.fechaNacimiento = new Date(1900, 0, 1);

    this.formularioNuevoPacienteSctr.controls['cboTipoDocumento'].reset();
    this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].reset();
    this.formularioNuevoPacienteSctr.controls['txtApePaterno'].reset();
    this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].reset();
    this.formularioNuevoPacienteSctr.controls['txtNombres'].reset();
    this.formularioNuevoPacienteSctr.controls['txtCelular'].reset();
    this.formularioNuevoPacienteSctr.controls['txtFechaNacimiento'].reset();
    this.formularioNuevoPacienteSctr.controls['cboSexo'].reset();

    this.statusBtnGuardarPaciente = false;
    this.statusBtnNuevoPaciente = true;
  }

  filtrarPaciente() {
    this.formularioNuevoPacienteSctr.controls['cboTipoDocumento'].disable();
    this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].disable();
    this.formularioNuevoPacienteSctr.controls['txtApePaterno'].disable();
    this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].disable();
    this.formularioNuevoPacienteSctr.controls['txtNombres'].disable();
    this.formularioNuevoPacienteSctr.controls['txtCelular'].disable();
    this.formularioNuevoPacienteSctr.controls['txtFechaNacimiento'].disable();
    this.formularioNuevoPacienteSctr.controls['cboSexo'].disable();

    this.formularioNuevoPacienteSctr.controls['cboTipoDocumento'].reset();
    this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].reset();
    this.formularioNuevoPacienteSctr.controls['txtApePaterno'].reset();
    this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].reset();
    this.formularioNuevoPacienteSctr.controls['txtNombres'].reset();
    this.formularioNuevoPacienteSctr.controls['txtCelular'].reset();
    this.formularioNuevoPacienteSctr.controls['txtFechaNacimiento'].reset();
    this.formularioNuevoPacienteSctr.controls['cboSexo'].reset();

    this.statusBtnGuardarPaciente = true;
    this.statusBtnNuevoPaciente = false;

    const dialogRef = this._dialog.open(ListadopacientesComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result.data)
      this.codPaciente = result.data.id_paciente;
      this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].setValue(result.data.numero_documento);
      this.formularioNuevoPacienteSctr.controls['txtApePaterno'].setValue(result.data.apellido_paterno);
      this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].setValue(result.data.apellido_materno);
      this.formularioNuevoPacienteSctr.controls['txtNombres'].setValue(result.data.nombres);
      this.formularioNuevoPacienteSctr.controls['txtCelular'].setValue(result.data.movil);
      this.fechaNacimiento = new Date(result.data.fecha_nacimiento);

      if (result.data.sexo == "M") {
        this.valSexo = 1;
      } else {
        this.valSexo = 2;
      }

      this.valTipoDocumento = 2;
    });
  }

  filterClientes(event: Event) {
    const ds = (event.target as HTMLInputElement).value;
    if (ds.length >= 3) {
      this._clienteService.getClienteListByRuc(ds).subscribe({
        next: (res) => {
          this.filtradoClientes = res.resultData;
        },
        error: console.log,
      });
    }
  }

  getSexosList() {
    this._parametroService.GetParametro('1').subscribe({
      next: (res) => {
        this.sexos = res.resultData;
      },
      error: console.log,
    });
  }

  getTipoDocumentosList() {
    this._tipoDocumentoService.GetTipoDocumentos().subscribe({
      next: (res) => {
        this.tipoDocumentos = res.resultData;
      },
      error: console.log,
    });
  }

  getMetodosValidacionList() {
    this._parametroService.GetParametro('5').subscribe({
      next: (res) => {
        this.validaciones = res.resultData;
      },
      error: console.log,
    });
  }

  getPlanesList() {
    this._planServices.GetPlanesList().subscribe({
      next: (res) => {
        this.planes = res.resultData;
      },
      error: console.log,
    });
  }

  getSexo(target: any) {
    this.valSexo = target.value;
  }

  getTipoDocumento(target: any) {
    this.valTipoDocumento = target.value;
  }

  getPaseAtencion(target: any) {
    paseAtencion = target.value;
    this.getMotivo();
  }

  getTipoAtencion(target: any) {
    this.tipoAtencion = target.value;
    this.getMotivo();
    if (this.tipoAtencion == 1) {
      this.statusBtnClinicaPrimAtencion = true;
    } else {
      this.statusBtnClinicaPrimAtencion = false;
    }
  }

  getMotivo() {
    this.motivos = [];

    this.formularioNuevaAtencionSctr.controls['cboMotivo'].reset();
    if ((this.tipoAtencion == 1 && paseAtencion == 0) || (this.tipoAtencion == 2 && paseAtencion == 0) || (this.tipoAtencion == 1 && paseAtencion == 1)) {
      this.formularioNuevaAtencionSctr.controls['cboMotivo'].disable();
    } else {
      this.getMotivoList(this.tipoAtencion, paseAtencion);
    }
  }

  getMotivoList(_tipoAtencion: number, _paseAtencion: number) {
    this._motivoService.GetMotivosListByTipoAndPase(_tipoAtencion, _paseAtencion).subscribe({
      next: (res) => {
        this.formularioNuevaAtencionSctr.controls['cboMotivo'].enable();
        this.motivos = res.resultData;
      },
      error: console.log,
    });
  }

  getMotivoValidacionCbo(target: any) {
    cboMotivoValidacion = target.value;
    if (cboMotivoValidacion == 3 || cboMotivoValidacion == 4) {
      this.formularioNuevaAtencionSctr.controls['cboPlan'].disable();
      this.formularioNuevaAtencionSctr.controls['cboPlan'].reset();
    } else {
      this.formularioNuevaAtencionSctr.controls['cboPlan'].enable();
    }
  }

  openMantClinicaDialog() {
    this._dialog.open(SctrMantenimientoclinicaComponent, {
      panelClass: 'sanna_theme',
      width: '620px'
    });
  }

  openAddClienteDialog() {
    const dialogRef = this._dialog.open(RegistraclienteComponent, {
      panelClass: 'sanna_theme',
      width: '430px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this._clienteService.getClienteListByRuc(result.data.ruc).subscribe({
        next: (res) => {
          this.filtradoClientes = res.resultData;
          this.verRuc(res.resultData);
          for (let option_ of this.filtradoClientes) {
            codCliente = parseInt(option_.id_cliente);
          }
          this.formularioNuevaAtencionSctr.get("txtEmpresa")?.setValue(result.data.nombre);
          this.valRuc = result.data.ruc;
        },
        error: console.log,
      });
    });
  }

  openClinicaDialog() {
    const dialogRef = this._dialog.open(ListadoclinicasComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codClinica = result.data.id_clinica;
      this.formularioNuevaAtencionSctr.controls['txtClinica'].setValue(result.data.clinica);
      this.formularioNuevaAtencionSctr.controls['txtDireccion'].setValue(result.data.direccion);
      this.formularioNuevaAtencionSctr.controls['txtTelefono'].setValue(result.data.telefono);
      this.formularioNuevaAtencionSctr.controls['txtAnexo'].setValue(result.data.anexo);
      if (result.data.afiliado == 1) {
        this.estadoClinica = "CLINICA AFILIADA";
        this.formularioNuevaAtencionSctr.controls['cboMetodoValidacion'].enable();
        this.formularioNuevaAtencionSctr.controls['cboPlan'].enable();
        this.formularioNuevaAtencionSctr.controls['txtRuc'].enable();
        this.formularioNuevaAtencionSctr.controls['txtEmpresa'].enable();
        this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].enable();
        this.statusBtnRegistrarAseguradora = false;
      } else {
        this.estadoClinica = "CLINICA NO AFILIADA";
        this.formularioNuevaAtencionSctr.controls['cboMetodoValidacion'].disable();
        this.formularioNuevaAtencionSctr.controls['cboPlan'].disable();
        this.formularioNuevaAtencionSctr.controls['txtRuc'].disable();
        this.formularioNuevaAtencionSctr.controls['txtEmpresa'].disable();
        this.formularioNuevaAtencionSctr.controls['rbHojaAtencion'].disable();
        this.statusBtnRegistrarAseguradora = true;
      }
    });
  }

  openClinicaPrimeraAtencionDialog() {
    const dialogRef = this._dialog.open(ListadoclinicasComponent, {
      panelClass: 'sanna_theme',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.codClinicaPrimeraAtencion = result.data.id_clinica;
      this.formularioNuevaAtencionSctr.controls['txtClinicaPrimeraAtencion'].setValue(result.data.clinica);
    });
  }

  selectCliente(option: MatOption) {
    codCliente = option.value.id_cliente;
    this.formularioNuevaAtencionSctr.get("txtEmpresa")?.setValue(option.value.nombre);
  }

  verRuc(cliente: Cliente): string {
    return cliente && cliente.ruc ? cliente.ruc.trim() : '';
  }

  exitAtencion() {
    this.formularioNuevaAtencionSctr.reset();
    this._dialogRef.close(true);
  }

  savePaciente() {
    if (this.formularioNuevoPacienteSctr.valid) {
      this.showSpinner = true;
      this.formularioNuevoPacienteSctr.controls['cboTipoDocumento'].disable();
      this.formularioNuevoPacienteSctr.controls['txtNroDocumento'].disable();
      this.formularioNuevoPacienteSctr.controls['txtApePaterno'].disable();
      this.formularioNuevoPacienteSctr.controls['txtApeMaterno'].disable();
      this.formularioNuevoPacienteSctr.controls['txtNombres'].disable();
      this.formularioNuevoPacienteSctr.controls['txtCelular'].disable();
      this.formularioNuevoPacienteSctr.controls['txtFechaNacimiento'].disable();
      this.formularioNuevoPacienteSctr.controls['cboSexo'].disable();
      this.statusBtnGuardarPaciente = true;
      this.statusBtnNuevoPaciente = false;

      this.persona.tipo_documento = this.valTipoDocumento.toString();
      this.persona.numero_documento = this.formularioNuevoPacienteSctr.value["txtNroDocumento"]?.toString() || '';
      this.persona.apellido_materno = this.formularioNuevoPacienteSctr.value["txtApeMaterno"]?.toString() || '';
      this.persona.apellido_paterno = this.formularioNuevoPacienteSctr.value["txtApePaterno"]?.toString() || '';
      this.persona.nombres = this.formularioNuevoPacienteSctr.value["txtNombres"]?.toString() || '';
      //this.persona.sexo = this.valSexo.toString();
      if (this.valSexo.toString() == "1") {
        this.persona.sexo = "M";
      } else {
        this.persona.sexo = "F";
      }
      this.fechaNacimiento = this.formularioNuevoPacienteSctr.value["txtFechaNacimiento"]?.toString();
      this.persona.fecha_nacimiento = new Date(this.fechaNacimiento);
      this.persona.celular = this.formularioNuevoPacienteSctr.value["txtCelular"]?.toString() || '';
      this.persona.usuario_creacion = this.usuarioEnlinea.id || '';
      console.log(this.persona)

      this._personaServices.addPersonaSctr(this.persona).subscribe({
        next: (val: any) => {
          this._pacientesServices.GetPacientesFiltro(this.persona.numero_documento, 'ApePaternoDni').subscribe({
            next: (res) => {
              for (let option_ of res.resultData) {
                this.codPaciente = parseInt(option_.id_paciente);
                this.showSpinner = false;
              }
            },
            error: console.log,
          });

          this.toastrService.success('¡Paciente creado satisfactoriamene!');
        },
        error: (err: any) => {
          this.showSpinner = false;
          console.error(err);
        },
      });
    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

  saveAtencionSctr() {
    this.showSpinner = true;
    if (this.formularioNuevaAtencionSctr.valid && this.codPaciente != null && codCliente != 0 && this.codClinica != null) {
      this.atencion.id_persona = this.codPaciente;
      this.atencion.id_empresa = codCliente;
      this.atencion.id_clinica = this.codClinica;
      this.atencion.id_clinica_primera_atencion = this.codClinicaPrimeraAtencion;
      this.atencion.id_motivo = this.formularioNuevaAtencionSctr.value["cboMotivo"] || '0';
      this.atencion.id_plan = this.formularioNuevaAtencionSctr.value["cboPlan"] || '0';
      //this.atencion.horario_trabajo = this.formularioNuevaAtencionSctr.value["txtInicioLabores"] + " " + this.formularioNuevaAtencionSctr.value["txtTerminoLabores"];
      //this.atencion.cargo = this.formularioNuevaAtencionSctr.value["txtPuestoCargo"] || '';
      //this.atencion.relato = this.formularioNuevaAtencionSctr.value["txtRelatoAccidente"] || '';
      //this.atencion.fecha_accidente = this.formularioNuevaAtencionSctr.value["txtFechaAccidente"] || '';
      //this.atencion.hora_accidente = this.formularioNuevaAtencionSctr.value["txtHoraAccidente"] || '';
      this.atencion.observacion = this.formularioNuevaAtencionSctr.value["txtObservacion"] || '';
      this.atencion.hoja_atencion = this.formularioNuevaAtencionSctr.value["rbHojaAtencion"]?.toString() || '';
      this.atencion.skill = this.rdSkill;
      this.atencion.motivo_skill = this.cboMotivo;
      this.atencion.metodo_validacion = cboMotivoValidacion.toString();
      this.atencion.primera_atencion = this.tipoAtencion.toString();
      this.atencion.persona_reporta_clinica = this.formularioNuevaAtencionSctr.value["txtPersonaReporta"] || '';
      this.atencion.estado = 1;

      //console.log(this.atencion)

      if (this.codAtencionEditar == null) {
        this.atencion.usuario_creacion = this.usuarioEnlinea.id || '';
        this._atencionServices.addAtencionSctr(this.atencion).subscribe({
          next: (val: any) => {
            this.showSpinner = false;
            this.toastrService.success('¡Atención creada satisfactoriamene!');
            this._dialogRef.close(true);
            cboMotivoValidacion = 0;
            paseAtencion = 0;
            codCliente = 0;
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      } else {
        this.atencion.usuario_modificacion = this.usuarioEnlinea.id || '';
        this.atencion.id_atencion = this.codAtencionEditar;
        this._atencionServices.updateAtencionSctr(this.atencion).subscribe({
          next: (val: any) => {
            this.showSpinner = false;
            this.toastrService.success('¡Atención actualizada satisfactoriamene!');
            this._dialogRef.close(true);
            cboMotivoValidacion = 0;
            paseAtencion = 0;
            codCliente = 0;
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }

    } else {
      this.toastrService.warning('¡Por favor complete los campos obligatorios!');
    }
  }

}