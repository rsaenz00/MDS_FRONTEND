import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewsRoutes } from './views-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarterComponent } from './layout/starter/starter.component';
import { MainComponent } from './layout/full/components/main/main.component';
import { MainblankComponent } from './layout/full/components/mainblank/mainblank.component';
import { WelcomeCardComponent } from './layout/full/shared/welcome-card/welcome-card.component';
import { TopCardsComponent } from './layout/full/shared/top-cards/top-cards.component';
import { PaymentsComponent } from './layout/full/shared/payments/payments.component';
import { ProductsComponent } from './layout/full/shared/products/products.component';
import { PaymentGatewaysComponent } from './layout/full/shared/payment-gateways/payment-gateways.component';
import { TopProjectsComponent } from './layout/full/shared/top-projects/top-projects.component';
import { CommonDialogComponent } from './layout/full/shared/common-dialog/common-dialog.component';
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
import { MadSitedsComponent } from './layout/mad-siteds/mad-siteds.component';
import { MadDireccionesComponent } from './layout/mad-direcciones/mad-direcciones.component';
import { MadNuevatencionComponent } from './layout/mad-nuevatencion/mad-nuevatencion.component';
import { SctrBandejaComponent } from './layout/sctr-bandeja/sctr-bandeja.component';
import { SctrSeguimientoComponent } from './layout/sctr-seguimiento/sctr-seguimiento.component';
import { SctrVerdatosComponent } from './layout/sctr-verdatos/sctr-verdatos.component';
import { SctrSoporteComponent } from './layout/sctr-soporte/sctr-soporte.component';
import { SctrTiposervicioComponent } from './layout/sctr-tiposervicio/sctr-tiposervicio.component';
import { SctrNuevatencionComponent } from './layout/sctr-nuevatencion/sctr-nuevatencion.component';
import { SctrRegistramotivoComponent } from './layout/sctr-registramotivo/sctr-registramotivo.component';
import { SctrMantenimientoclinicaComponent } from './layout/sctr-mantenimientoclinica/sctr-mantenimientoclinica.component';
import { ListadoubigeosComponent } from './layout/listadoubigeos/listadoubigeos.component';
import { ListadoclinicasComponent } from './layout/listadoclinicas/listadoclinicas.component';

@NgModule({
  declarations: [
    // MainComponent,
    // MainblankComponent,
    // WelcomeCardComponent,
    // TopCardsComponent,
    // PaymentsComponent,
    // ProductsComponent,
    // PaymentGatewaysComponent,
    // TopProjectsComponent
  
    CommonDialogComponent
  ],
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
    MadSitedsComponent,
    MadDireccionesComponent,
    MadNuevatencionComponent,
    SctrBandejaComponent,
    SctrSeguimientoComponent,
    SctrVerdatosComponent,
    SctrSoporteComponent,
    SctrTiposervicioComponent,
    SctrNuevatencionComponent,
    SctrRegistramotivoComponent,
    SctrMantenimientoclinicaComponent,
    ListadoubigeosComponent,
    ListadoclinicasComponent
  ]
})
export class ViewsModule { }
