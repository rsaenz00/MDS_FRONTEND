import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLoginListComponent } from './components/audit-login-list/audit-login-list.component';
import { AuthGuard } from 'src/app/helpers/security/auth.guard';

const routes: Routes = 
[
  {
    path: '',
    component: AuditLoginListComponent,
    data: { claimType: 'audit_login_list',title:'Auditoria Login' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditLoginRoutingModule { }
