import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(AuthRoutingModule),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    LoginComponent,
    RegisterComponent
  ]
})
export class AuthModule { }
