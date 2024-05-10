import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './views/layout/full/full.component';
import { BlankComponent } from './views/layout/blank/blank.component';
import { AuthGuard } from './helpers/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/modules.module').then((m) => m.ModulesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
