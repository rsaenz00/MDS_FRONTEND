import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewsRoutes } from './views-routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarterComponent } from './layout/starter/starter.component';
import { BandejaComponent } from './layout/bandeja/bandeja.component';


@NgModule({
  declarations: [    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(ViewsRoutes),
    StarterComponent,
    BandejaComponent
  ]
})
export class ViewsModule { }
