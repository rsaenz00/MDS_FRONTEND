import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { GestionPacientesRoutingModule } from './gestion-pacientes-routing.module';
import { AmbulanciaComponent } from './components/ambulancia/ambulancia.component';
import { SctrComponent } from './components/sctr/sctr.component';
import { CronicosComponent } from './components/cronicos/cronicos.component';
import { MadComponent } from './components/mad/mad.component';
import { DrOnlineComponent } from './components/dr-online/dr-online.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

//SERVICIOS MAD
import { MensajeComponent } from './components/mad/components/mensaje/mensaje.component';
import { MadSeguimientoComponent } from './components/mad/components/seguimiento/mad-seguimiento.component';
import { MadNuevaAtencionComponent } from './components/mad/components/nuevaatencion/mad-nuevaatencion.component';
import { ConsultaDniComponent } from './components/mad/components/consultadni/consultadni.component';
import { NuevoPacienteComponent } from './components/mad/components/nuevopaciente/mad-nuevopaciente.component';
import { NuevaDireccionComponent } from './components/mad/components/nuevadireccion/mad-nuevadireccion.component';
import { MadNuevoMedicoComponent } from './components/mad/components/nuevomedico/mad-nuevomedico.component';
import { SitedsComponent } from './components/mad/components/siteds/siteds.component';

//SERVICIOS SCTR
import { ListadopacientesComponent } from './components/sctr/components/sctr-listado-pacientes/listado-pacientes.component';
import { SctrTiposervicioComponent } from './components/sctr/components/sctr-tipo-servicio/sctr-tipo-servicio.component';
import { ListadoclinicasComponent } from './components/sctr/components/sctr-listado-clinicas/listado-clinicas.component';
import { ListadoubigeosComponent } from './components/sctr/components/sctr-listado-ubigeos/listado-ubigeos.component';
import { SctrMantenimientoclinicaComponent } from './components/sctr/components/sctr-mantenimiento-clinica/sctr-mantenimiento-clinica.component';
import { SctrNuevatencionComponent } from './components/sctr/components/sctr-nueva-atencion/sctr-nueva-atencion.component';
import { SctrRegistramotivoComponent } from './components/sctr/components/sctr-registra-motivo/sctr-registra-motivo.component';
import { SctrSeguimientoComponent } from './components/sctr/components/sctr-seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from './components/sctr/components/sctr-soporte/sctr-soporte.component';
import { SctrVerdatosComponent } from './components/sctr/components/sctr-ver-datos/sctr-ver-datos.component';
import { ConfirmaranularatencionComponent } from './components/sctr/components/sctr-confirmar-anular-atencion/confirmar-anular-atencion.component';
import { RegistraclienteComponent } from './components/sctr/components/sctr-registra-cliente/registra-cliente.component';
import { SctrReporteComponent } from './components/sctr/components/sctr-reporte/sctr-reporte.component';

//SERVICIOS AMBULANCIA
import { AmbNuevoServicioComponent } from './components/ambulancia/components/amb-nuevo-servicio/amb-nuevo-servicio.component';
import { AmbDatosAtencionComponent } from './components/ambulancia/components/amb-datos-atencion/amb-datos-atencion.component';
import { AmbSoporteComponent } from './components/ambulancia/components/amb-soporte/amb-soporte.component';
import { AmbNuevaAlertaComponent } from './components/ambulancia/components/amb-nueva-alerta/amb-nueva-alerta.component';
import { AmbAlertasComponent } from './components/ambulancia/components/amb-alertas/amb-alertas.component';
import { AmbSeguimientoComponent } from './components/ambulancia/components/amb-seguimiento/amb-seguimiento.component';
import { AmbAtencionesPasadasComponent } from './components/ambulancia/components/amb-atenciones-pasadas/amb-atenciones-pasadas.component';
import { AmbNuevaOrientacionMedicaComponent } from './components/ambulancia/components/amb-nueva-orientacion-medica/amb-nueva-orientacion-medica.component';
import { AmbNuevaAtencionComponent } from './components/ambulancia/components/amb-nueva-atencion/amb-nueva-atencion.component';
import { AmbSitedsComponent } from './components/ambulancia/components/amb-siteds/amb-siteds.component';
import { AmbNuevoEventoComponent } from './components/ambulancia/components/amb-nuevo-evento/amb-nuevo-evento.component';
import { AmbConfirmaranularatencionComponent } from './components/ambulancia/components/amb-confirmar-anular-atencion/amb-confirmar-anular-atencion.component';
import { AmbMotivoAnularServicioComponent } from './components/ambulancia/components/amb-motivo-anular-servicio/amb-motivo-anular-servicio.component';
import { AmbMantenimientoSedesComponent } from './components/ambulancia/components/amb-mantenimiento-sedes/amb-mantenimiento-sedes.component';
import { AmbMantenimientoDireccionesComponent } from './components/ambulancia/components/amb-mantenimiento-direcciones/amb-mantenimiento-direcciones.component';

@NgModule({
  declarations: [
    AmbulanciaComponent,
    CronicosComponent,
    MensajeComponent,
    MadNuevoMedicoComponent,
    MadComponent,
    MadSeguimientoComponent,
    MadNuevaAtencionComponent,
    ConsultaDniComponent,
    NuevoPacienteComponent,
    NuevaDireccionComponent,
    DrOnlineComponent,
    ListadoclinicasComponent,
    ListadopacientesComponent,
    ListadoubigeosComponent,
    SctrComponent,
    SctrMantenimientoclinicaComponent,
    SctrTiposervicioComponent,
    SctrMantenimientoclinicaComponent,
    SctrNuevatencionComponent,
    SctrRegistramotivoComponent,
    SctrSeguimientoComponent,
    SctrSoporteComponent,
    SctrVerdatosComponent,
    ConfirmaranularatencionComponent,
    RegistraclienteComponent,
    SctrReporteComponent,
    SitedsComponent,
    AmbNuevoServicioComponent,
    AmbDatosAtencionComponent,
    AmbSoporteComponent,
    AmbNuevaAlertaComponent,
    AmbAlertasComponent,
    AmbSeguimientoComponent,
    AmbAtencionesPasadasComponent,
    AmbNuevaOrientacionMedicaComponent,
    AmbNuevaAtencionComponent,
    AmbSitedsComponent,
    AmbNuevoEventoComponent,
    AmbConfirmaranularatencionComponent,
    AmbMotivoAnularServicioComponent,
    AmbMantenimientoSedesComponent,
    AmbMantenimientoDireccionesComponent
  ],
  imports: [
    CommonModule,
    GestionPacientesRoutingModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    TablerIconsModule.pick(TablerIcons),
    MatProgressSpinnerModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ]
})

export class GestionPacientesModule { }
