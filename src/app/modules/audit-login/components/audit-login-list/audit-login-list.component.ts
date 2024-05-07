import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// import { BaseComponent } from 'src/app/base.component';
import { AuditLoginListDataSource } from './audit-login-list-datasource';
import { AuditLoginResource } from 'src/app/models/resources/audit-login-resource';
import { AuditLogin } from 'src/app/models/audit-login';
import { Observable, debounceTime, distinctUntilChanged, fromEvent, merge, tap } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { AuditLoginService } from 'src/app/services/audit-login.service';
import { BaseComponent } from 'src/app/base/base.component';
import { ResponseHeader } from 'src/app/models/resources/response-header';
import { RouterModule } from '@angular/router';

@Component({
  standalone:true,
  selector: 'app-audit-login-list',
  templateUrl: './audit-login-list.component.html',
  styleUrl: './audit-login-list.component.scss',
  imports:[RouterModule,MaterialModule,TablerIconsModule,NgIf]
})
export class AuditLoginListComponent extends BaseComponent implements OnInit, AfterViewInit
{
  dataSource: AuditLoginListDataSource;
  loginAudits: AuditLogin[] = [];
  displayedColumns: string[] = ['fecha','usuario','estado','descripcion','ip','latitud','longitud'];
  // displayedColumns: string[] = ['loginTime', 'userName', 'remoteIP', 'status', 'latitude', 'longitude'];
  isLoadingResults = true;
  loginAuditResource: AuditLoginResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private loginAuditService: AuditLoginService) 
  {
    super();
    this.loginAuditResource = new AuditLoginResource();
    this.loginAuditResource.pageSize = 10;
    this.loginAuditResource.orderBy = 'fecha desc';
    this.loginAuditResource.userName = 'RSAENZ';
    this.loginAuditResource.searchQuery = 'RSAENZ';
    this.loginAuditResource.id = 'RSAENZ';
    this.loginAuditResource.fields = 'RSAENZ';
  }

  ngOnInit(): void 
  {
    this.dataSource = new AuditLoginListDataSource(this.loginAuditService);
    this.dataSource.loadLoginAudits(this.loginAuditResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.loginAuditResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.loginAuditResource.pageSize = this.paginator.pageSize;
          this.loginAuditResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadLoginAudits(this.loginAuditResource);
        })
      )
      .subscribe();

    this.sub$.sink = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loginAuditResource.userName = this.input.nativeElement.value;
          this.dataSource.loadLoginAudits(this.loginAuditResource);
        })
      )
      .subscribe();
  }

  getResourceParameter() 
  {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader| any) => {
        if (c) {
          this.loginAuditResource.pageSize = c.pageSize;
          this.loginAuditResource.skip = c.skip;
          this.loginAuditResource.totalCount = c.totalCount;
        }
      });
  }

}
