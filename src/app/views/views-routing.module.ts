import { Routes } from '@angular/router';
import { StarterComponent } from './layout/starter/starter.component';

export const ViewsRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter Page',
    },
  },
];


