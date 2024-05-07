import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { AuthGuard } from 'src/app/helpers/security/auth.guard';
import { UsuarioManageComponent } from './components/usuario-manage/usuario-manage.component';

const routes: Routes = 
[
  {
    path: '',
    component: UsuarioListComponent,
    data: { claimType: 'usuario_list',title:'Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion',
    component: UsuarioManageComponent,
    data: { title:'Agregar Usuario' },
    // data: { claimType: 'usuario_add',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
  {
    path: 'gestion/:id',
    component: UsuarioManageComponent,
    data: { claimType: 'usuario_edit',title:'Agregar Usuario' },
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
