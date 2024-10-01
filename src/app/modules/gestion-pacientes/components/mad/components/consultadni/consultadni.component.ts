import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ClinicaService } from 'src/app/services/clinica.service';
import { ClinicasFiltro, HistoriaDni } from 'src/app/models/clinica.model';
import { MatPaginator } from '@angular/material/paginator';
import { NuevoPacienteComponent } from '../nuevopaciente/mad-nuevopaciente.component';
import { MadNuevaAtencionComponent } from '../nuevaatencion/mad-nuevaatencion.component';
import { PacienteService } from 'src/app/services/paciente.service';
import { PacientexDni } from 'src/app/models/paciente.model';
import { ToastrService } from 'ngx-toastr';
import { CoreService } from 'src/app/services/core.service';

var vNumeroDNI='';

@Component({
  selector: 'app-consultadni',
  templateUrl: './consultadni.component.html',
  styleUrl: './consultadni.component.scss'
})

export class ConsultaDniComponent implements OnInit {
  options = this.settings.getOptions();
  displayedColumns: string[] = ['dni','paciente'];
  dataSource!: MatTableDataSource<HistoriaDni>;
  countRows: number = 0;
  idRow  = '';
  rowSeleccionado: any;
  positionRow: number;
  showSpinner = false;
  public txtTodos = '';
  public txtCodigo = '';
  public txtNombre = '';
  public txtPaterno = '';
  public txtMaterno = '';
  public txtDni = '';
  public txtEmail = '';
  public txtPaciente = '';
  constructor(
    private settings: CoreService,
    private _pacientesService: PacienteService,
    private toastrService: ToastrService,
    private _dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer, 
    private _clinicasServices: ClinicaService, 
    private frm: FormBuilder,
    private _dialogRef: MatDialogRef<ConsultaDniComponent>) { }

formularioClinicas = this.frm.group({
    txtTodos: [{ value: '', disabled: false }, Validators.required],
    txtCodigo: [''],
    txtNombre: [''],
    txtPaterno: [''],
    txtMaterno: [''],
    txtDni: [''],
    txtEmail: [''],
    txtPaciente: ['']
  });

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  CMDRegistrar = true;
  CMDAtencion = true;

  ngOnInit(): void {
    this.getClinicasList('','');
  }

  getFilterPredicate(tipo: string) {
    return (row: HistoriaDni, filters: string) => {
      const txtTodos = filters;
      const txtCodigo = filters;
      const txtNombre = filters;
      const txtPaterno = filters;
      const txtMaterno = filters;
      const txtDni = filters;
      const txtEmail = filters;
      const txtPaciente = filters;
      const columnDni = row.dni;
      const columnPaciente = row.paciente;
      var customFilter = false;
      if (tipo == 'Todos') {
        customFilter = 
        columnDni.toLowerCase().includes(txtTodos)||  
        columnPaciente.toLowerCase().includes(txtTodos);
      }

      const matchFilter: any[] = [];
      matchFilter.push(customFilter);
      return matchFilter.every(Boolean);
    };
  }


  getClinicaList() {
    this._clinicasServices.GetClinicasList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }


  getClinicasList(busqueda: string, condicion: string) {
    this._clinicasServices.GetClinicasFiltro(busqueda, condicion).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.countRows = this.dataSource.filteredData.length;
      },
      error: console.log,
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrarTodos(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtEmail'].reset();
    this.formularioClinicas.controls['txtPaciente'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtTodos = ds === null ? '' : ds;

    if (this.txtTodos == '') {
      this.getClinicasList('', '');
    } 
    else 
      {
        this.getClinicasList(this.txtTodos, 'Todos');
      }  
  }

  filtrarCodigo(event: Event) {
    //this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtCodigo = ds === null ? '' : ds;

    if (this.txtCodigo == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtCodigo, 'Codigo');
    }
  }

  filtrarNombre(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    //this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtEmail'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtNombre = ds === null ? '' : ds;

    if (this.txtNombre == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtNombre, 'Nombre');
    }
  }

  filtrarPaterno(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    //this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtPaterno = ds === null ? '' : ds;

    if (this.txtPaterno == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtPaterno, 'Paterno');
    }

  }

  filtrarMaterno(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    //this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();

    const ds = (event.target as HTMLInputElement).value;
    this.txtMaterno = ds === null ? '' : ds;

    if (this.txtMaterno == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtMaterno, 'Materno');
    }
  }
  filtrarDni(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    //this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();
    const ds = (event.target as HTMLInputElement).value;
    this.txtDni = ds === null ? '' : ds;
    if (this.txtDni == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtDni, 'Dni');
    }
  }
  filtrarEmail(event: Event) {
    this.formularioClinicas.controls['txtCodigo'].reset();
    this.formularioClinicas.controls['txtNombre'].reset();
    this.formularioClinicas.controls['txtPaterno'].reset();
    this.formularioClinicas.controls['txtMaterno'].reset();
    this.formularioClinicas.controls['txtDni'].reset();
    this.formularioClinicas.controls['txtTodos'].reset();
    const ds = (event.target as HTMLInputElement).value;
    this.txtEmail = ds === null ? '' : ds;
    if (this.txtEmail == '') {
      this.getClinicasList('', '');
    } else {
      this.getClinicasList(this.txtEmail, 'Email');
    }
  }
  filaSeleccionada(row: HistoriaDni) {
    this._dialogRef.close({
      data: row
    });
  }
  hdni: HistoriaDni = {} as HistoriaDni;
  paciente: PacientexDni = {} as PacientexDni;
  vRegistro = 0;
  getRowSelected(row: PacientexDni, position: number) {
    this.positionRow = position;
    this.idRow = row["dni"];
    this.rowSeleccionado = row;
  }
  getPacientesList(vBusqueda: string,vValor: string) {
    this.displayedColumns  = ['dni','paciente'];
    vNumeroDNI = this.formularioClinicas.value["txtTodos"]?.toString() || '';
    this._pacientesService.GetPaciente_By_Dni(vBusqueda,vValor).subscribe({
    next: (res) => {
        this.dataSource = new MatTableDataSource(res.resultData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.showSpinner = false;
        this.countRows = this.dataSource.filteredData.length;          
          this.vRegistro = this.countRows;
          if(this.vRegistro == 1 || this.vRegistro == 2)
          {
            this.toastrService.success('EL NUMERO DEL DNI' + ' : ' + vNumeroDNI + ' ' +  'INGRESADO SI EXISTE');
            this.CMDRegistrar = true;
            this.CMDAtencion = false;
          }
          else
          {
            this.toastrService.warning('EL NUMERO DEL DNI' + ' : ' + vNumeroDNI + ' ' +  'INGRESADO NO EXISTE');
            this.CMDRegistrar = true;
            this.CMDAtencion = false;
          }
      },
      error: console.log,
    });
  }
  BuscarNumeroDni(){
    if (this.formularioClinicas.valid) {
      this.showSpinner = true;
      vNumeroDNI = this.formularioClinicas.value["txtTodos"]?.toString() || '';      
      if(vNumeroDNI.length < 8 )
      {
        this.toastrService.warning('¡EL NUMERO DEL DNI DEBE CONTENER 8 DIGITOS!');
      }
      else
      {
        this.getPacientesList("Dni",vNumeroDNI);
      }
    } 
    else 
    {
      this.toastrService.warning('¡INGRESE EL NUMERO DEL DNI DEL PACIENTE A CONSULTAR...!');
    }
  }
  SalirVentanaPaciente() {
    this._dialogRef.close(true);
  }
  openNuevoPacienteDialog() {  
    const dialogRef = this._dialog.open(NuevoPacienteComponent, {
      panelClass: 'sanna_theme',
      disableClose: true,
      width: "800px",
    });
  }
  openNuevaAtencionPacienteDialog() {
    if(this.vRegistro == 0)
      {
        this.toastrService.warning('NO EXISTEN REGISTROS QUE SELECCIONAR');
        this._dialog.open(MadNuevaAtencionComponent,{
          panelClass:'sanna_theme',
          data: {'dni':this.idRow},
          });
        this.CMDAtencion = false;
      }
    else
    {
      if (this.idRow != '') 
        {
          this._dialog.open(MadNuevaAtencionComponent,{
          panelClass:'sanna_theme',
          data: {'dni':this.idRow},
          });
          this._dialogRef.close(true);
        } 
        else 
        {
          this.toastrService.warning('DEBE SELECCIONAR AL PACIENTE PARA CONTINUAR CON SU ATENCION');
        }
    }
  } 
  openAtencionPacienteDialog() {
    const dialogRef = this._dialog.open(MadNuevaAtencionComponent, {
      panelClass: 'sanna_theme',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
 
    });
  }
 
}