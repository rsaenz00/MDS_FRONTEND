import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './views/layout/full/full.component';
import { BlankComponent } from './views/layout/blank/blank.component';
import { BandejaComponent } from './views/layout/bandeja/bandeja.component';
import { MadBandejaComponent } from './views/layout/mad-bandeja/mad-bandeja.component';
import { MadNuevatencionComponent } from './views/layout/mad-nuevatencion/mad-nuevatencion.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'starter',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./views/views.module').then((m) => m.ViewsModule),
      },
      {
        path: 'bandeja',
        component: BandejaComponent,
        data: {
          title: 'Bandeja de atenciones'
        },
      },
      {
        path: 'bandejamad',
        component: MadBandejaComponent,
        data: {
          title: 'Bandeja de atenciones médico a domicilio (MAD)'
        },
      },
      {
        path: 'nuevatencionmad',
        component: MadNuevatencionComponent,
        data: {
          title: 'Nueva atención médica a domicilio (MAD)'
        },
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./views/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
