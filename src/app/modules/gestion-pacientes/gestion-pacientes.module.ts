import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionPacientesRoutingModule } from './gestion-pacientes-routing.module';
import { AmbulanciaComponent } from './components/ambulancia/ambulancia.component';
import { SctrComponent } from './components/sctr/sctr.component';
import { CronicosComponent } from './components/cronicos/cronicos.component';
import { MadComponent } from './components/mad/mad.component';
import { DrOnlineComponent } from './components/dr-online/dr-online.component';


@NgModule({
  declarations: [
    AmbulanciaComponent,
    CronicosComponent,
    MadComponent,
    DrOnlineComponent
  ],
  imports: [
    CommonModule,
    GestionPacientesRoutingModule,
    SctrComponent,
  ]
})
export class GestionPacientesModule { }
