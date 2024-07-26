import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmbulanciaComponent } from './components/ambulancia/ambulancia.component';
import { AuthGuard } from 'src/app/helpers/security/auth.guard';
import { SctrComponent } from './components/sctr/sctr.component';
import { DrOnlineComponent } from './components/dr-online/dr-online.component';
import { SctrReporteComponent } from './components/sctr/components/reporte/sctr-reporte.component';
import { SitedsComponent } from './components/mad/components/siteds/siteds.component';
import { MadComponent } from './components/mad/mad.component';
import { CronicosComponent } from './components/cronicos/cronicos.component';

const routes: Routes = 
[
  {
    path: 'ambulancia',
    component: AmbulanciaComponent,
    data: { title:'Ambulancia' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'cronicos',
    component: CronicosComponent,
    data: { title:'Cronicos' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'dr-online',
    component: DrOnlineComponent,
    data: { title:'Dr Online' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'mad',
    component: MadComponent,
    data: { title:'Medicos a Domicilio' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'sctr',
    component: SctrComponent,
    data: { title:'SCTR - Seguro Complementario de Trabajo de Riesgo' },
    canActivate: [AuthGuard]
  },
  {
    path: 'sctr-reporte',
    component: SctrReporteComponent,
    data: { title:'Reporte SCTR - Seguro Complementario de Trabajo de Riesgo' },
    canActivate: [AuthGuard]
  },
  {
    path: 'siteds',
    component: SitedsComponent,
    data: { title:'SITEDS' },
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPacientesRoutingModule { }
