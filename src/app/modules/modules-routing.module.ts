import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from '../views/layout/blank/blank.component';
import { AuthGuard } from '../helpers/security/auth.guard';
import { MainComponent } from '../views/layout/full/components/main/main.component';
import { MainblankComponent } from '../views/layout/full/components/mainblank/mainblank.component';

const routes: Routes = 
[
  {
    path: 'auth',
    component: BlankComponent,
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '', 
      children: 
      [
        {
          path: '',
          component: MainblankComponent,
          canLoad: [AuthGuard],
          title: 'Dashboard',
          loadChildren: () =>
            import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        },
        {
          path: 'audit-login',
          component: MainComponent,
          canLoad: [AuthGuard],
          title: 'Auditoria Login',
          loadChildren: () =>
            import('./audit-login/audit-login.module').then((m) => m.AuditLoginModule),
        },
        {
          path: 'usuario',
          component: MainComponent,
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./usuario/usuario.module').then((m) => m.UsuarioModule),
        },
        {
          path: 'gestion-pacientes',
          component: MainComponent,
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./gestion-pacientes/gestion-pacientes.module').then((m) => m.GestionPacientesModule),
        },
      ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
