import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/helpers/security/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Title } from '@angular/platform-browser';

const routes: Routes = 
[
  {
    path: '',
    data: { claimType: 'dashboard_list', },
    canActivate: [AuthGuard],
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
