import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewsRoutes } from './views-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarterComponent } from './layout/starter/starter.component';
import { BandejaComponent } from './layout/bandeja/bandeja.component';
import { SoporteComponent } from './layout/soporte/soporte.component';
import { MadBandejaComponent } from './layout/mad-bandeja/mad-bandeja.component';
import { MadSeguimientoComponent } from './layout/mad-seguimiento/mad-seguimiento.component';
import { MadIncidenciaComponent } from './layout/mad-incidencia/mad-incidencia.component';
import { MadAuditoriatencionComponent } from './layout/mad-auditoriatencion/mad-auditoriatencion.component';
import { MadSoporteComponent } from './layout/mad-soporte/mad-soporte.component';
import { MadMostrardatosComponent } from './layout/mad-mostrardatos/mad-mostrardatos.component';
import { MadIngresarcodigosComponent } from './layout/mad-ingresarcodigos/mad-ingresarcodigos.component';
import { MadDatoscomprobantepagoComponent } from './layout/mad-datoscomprobantepago/mad-datoscomprobantepago.component';
import { MadHistorialencuestaComponent } from './layout/mad-historialencuesta/mad-historialencuesta.component';
import { MadEditarservicioComponent } from './layout/mad-editarservicio/mad-editarservicio.component';
import { MadDatospacienteComponent } from './layout/mad-datospaciente/mad-datospaciente.component';
//import { MadSitedsComponent } from './layout/mad-siteds/mad-siteds.component';
//import { MadDireccionesComponent } from './layout/mad-direcciones/mad-direcciones.component';
import { MadNuevatencionComponent } from './layout/mad-nuevatencion/mad-nuevatencion.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(ViewsRoutes),
    StarterComponent,
    BandejaComponent,
    SoporteComponent,
    MadBandejaComponent,
    MadSeguimientoComponent,
    MadIncidenciaComponent,
    MadAuditoriatencionComponent,
    MadSoporteComponent,
    MadMostrardatosComponent,
    MadIngresarcodigosComponent,
    MadDatoscomprobantepagoComponent,
    MadHistorialencuestaComponent,
    MadEditarservicioComponent,
    MadDatospacienteComponent,
    //MadSitedsComponent,
    //MadDireccionesComponent,
    MadNuevatencionComponent
  ]
})
export class ViewsModule { }
