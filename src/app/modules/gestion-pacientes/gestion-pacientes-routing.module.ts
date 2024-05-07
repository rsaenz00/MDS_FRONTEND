import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmbulanciaComponent } from './components/ambulancia/ambulancia.component';
import { AuthGuard } from 'src/app/helpers/security/auth.guard';
import { SctrComponent } from './components/sctr/sctr.component';
import { DrOnlineComponent } from './components/dr-online/dr-online.component';

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
    component: SctrComponent,
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
    component: SctrComponent,
    data: { title:'Medicos a Domicilio' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'sctr',
    component: SctrComponent,
    data: { title:'SCTR' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPacientesRoutingModule { }
