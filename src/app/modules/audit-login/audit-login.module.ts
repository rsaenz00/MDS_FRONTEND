import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { AuditLoginRoutingModule } from './audit-login-routing.module';
import { AuditLoginListComponent } from './components/audit-login-list/audit-login-list.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    // AuditLoginListComponentl
  ],
  imports: [
    CommonModule,
    AuditLoginRoutingModule,
    TablerIconsModule.pick(TablerIcons),
    MaterialModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    AuditLoginListComponent
  ]
})
export class AuditLoginModule { }
