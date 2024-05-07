import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FullComponent } from './views/layout/full/full.component';
import { BlankComponent } from './views/layout/blank/blank.component';
import { AuthGuard } from './helpers/security/auth.guard';

const routes: Routes = 
[
  {
    path: '',
    loadChildren: () =>
          import('./modules/modules.module').then((m) => m.ModulesModule), 
  }
];
// [
//   {
//     path: 'auth',
//     component: BlankComponent,
//     loadChildren: () =>
//       import('./views/auth/auth.module').then((m) => m.AuthModule),
//   },
//   {
//     path: '',
//       component: FullComponent,
//       children: 
//       [
//         {
//           path: '',
//           canLoad: [AuthGuard],
//           loadChildren: () =>
//             import('./views/views.module').then((m) => m.ViewsModule),
//         }
//       ]
//   },
// ];
//
// [
// {
//   path: '',
//     component: FullComponent,
//     children: [
//       {
//         path: '',
//         redirectTo: 'starter',
//         pathMatch: 'full',
//       },
//       {
//         path: 'starter',
//         loadChildren: () =>
//           import('./views/views.module').then((m) => m.ViewsModule),
//       },
//     ],
// },
// {
//   path: '',
//   component: BlankComponent,
//   children: [
//     {
//       path: 'auth',
//       loadChildren: () =>
//         import('./views/auth/auth.module').then((m) => m.AuthModule),
//     },
//   ],
// },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
