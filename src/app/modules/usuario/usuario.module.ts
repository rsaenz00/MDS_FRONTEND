import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UsuarioListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioManageComponent } from './components/usuario-manage/usuario-manage.component';
import { UsuarioPermissionComponent } from './components/usuario-permission/usuario-permission.component';
import { UsuarioResetPasswordComponent } from './components/usuario-reset-password/usuario-reset-password.component';


@NgModule({
  declarations: [
    UsuarioListComponent,
    UsuarioPermissionComponent,
    UsuarioResetPasswordComponent,
    // UsuarioAddComponent,
    // UsuarioManageComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    TablerIconsModule.pick(TablerIcons),
    MaterialModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuarioModule { }
