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
import { ListadopacientesComponent } from './components/sctr/components/listadopacientes/listadopacientes.component';
import { SctrTiposervicioComponent } from './components/sctr/components/tiposervicio/sctr-tiposervicio.component';
import { ListadoclinicasComponent } from './components/sctr/components/listadoclinicas/listadoclinicas.component';
import { ListadoubigeosComponent } from './components/sctr/components/listadoubigeos/listadoubigeos.component';
import { SctrMantenimientoclinicaComponent } from './components/sctr/components/mantenimientoclinica/sctr-mantenimientoclinica.component';
import { SctrNuevatencionComponent } from './components/sctr/components/nuevatencion/sctr-nuevatencion.component';
import { SctrRegistramotivoComponent } from './components/sctr/components/registramotivo/sctr-registramotivo.component';
import { SctrSeguimientoComponent } from './components/sctr/components/seguimiento/sctr-seguimiento.component';
import { SctrSoporteComponent } from './components/sctr/components/soporte/sctr-soporte.component';
import { SctrVerdatosComponent } from './components/sctr/components/verdatos/sctr-verdatos.component';

@NgModule({
  declarations: [
    AmbulanciaComponent,
    CronicosComponent,
    MadComponent,
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
    SctrVerdatosComponent
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
    ReactiveFormsModule
  ]
})

export class GestionPacientesModule { }
