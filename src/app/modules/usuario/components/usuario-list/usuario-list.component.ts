import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base/base.component';
import { UsuarioResource } from 'src/app/models/resources/usuario-resource';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioListDataSource } from './usuario-list-datasource';
import { ResponseHeader } from 'src/app/models/resources/response-header';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioResetPasswordComponent } from '../usuario-reset-password/usuario-reset-password.component';
import { UntypedFormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, debounceTime, distinctUntilChanged, merge, tap } from 'rxjs';
import { CommonDialogService } from 'src/app/services/common-dialog.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent extends BaseComponent implements OnInit, AfterViewInit 
{
  dataSource: UsuarioListDataSource;
  usuarios: Usuario[] = [];
  usuarioResource: UsuarioResource;
  displayedColumns: string[] = ['usuario','nombres','email','estado','accion'];
  footerToDisplayed: string[] = ["footer"];
  isLoadingResults = true;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  usuarioFilterCtl: UntypedFormControl = new UntypedFormControl('');
  nombresFilterCtl: UntypedFormControl = new UntypedFormControl('');
  emailFilterCtl: UntypedFormControl = new UntypedFormControl('');

  constructor
  (
    private usuarioService: UsuarioService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    // private translationService: TranslationService
  ) 
  {
    super();
    this.usuarioResource = new UsuarioResource();
    this.usuarioResource.pageSize = 10;
    this.usuarioResource.orderBy = 'email desc'
  }

  ngOnInit(): void 
  {
    this.dataSource = new UsuarioListDataSource(this.usuarioService);
    this.dataSource.loadUsers(this.usuarioResource);
    this.getResourceParameter();
    this.filterLogic();
  }

  getResourceParameter() 
  {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader | any) => {
        if (c) {
          this.usuarioResource.pageSize = c.pageSize;
          this.usuarioResource.skip = c.skip;
          this.usuarioResource.totalCount = c.totalCount;
        }
      });
  }

  resetPassword(usuario: Usuario): void 
  {
    this.dialog.open
    (
      UsuarioResetPasswordComponent, 
      {
        width: '350px',
        data: Object.assign({}, usuario)
      }
    );
  }
  filterLogic() 
  {
    // this.sub$.sink = this.usuarioFilterCtl.valueChanges.pipe
    // (
    //   debounceTime(400),
    //   distinctUntilChanged()
    // ).subscribe
    // (
    //   c => 
    //   {
    //   this.usuarioResource.usuario = c;
    //   this.usuarioResource.skip = 0;
    //   this.dataSource.loadUsers(this.usuarioResource);
    //   }
    // );

    // this.sub$.sink = this.nombresFilterCtl.valueChanges.pipe
    // (
    //   debounceTime(400),
    //   distinctUntilChanged()
    // ).subscribe
    // (
    //   c => 
    //   {
    //   this.usuarioResource.nombres = c;
    //   this.usuarioResource.skip = 0;
    //   this.dataSource.loadUsers(this.usuarioResource);
    //   }
    // );

    this.sub$.sink = this.emailFilterCtl.valueChanges.pipe
    (
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe
    (
      c => 
      {
        this.usuarioResource.email = c;
        this.usuarioResource.skip = 0;
        this.dataSource.loadUsers(this.usuarioResource);
      }
    );

  //   this.sub$.sink = this.fullNameFilterCtl.valueChanges.pipe(
  //     debounceTime(400),
  //     distinctUntilChanged()
  //   ).subscribe(c => {
  //     if (c) {
  //       const name = c.trim().split(' ');
  //       this.userResource.first_name = name[0];
  //       if (name.length > 1)
  //         this.userResource.last_name = name[1];
  //       this.userResource.skip = 0;
  //     } else {
  //       this.userResource.first_name = '';
  //       this.userResource.last_name = '';
  //       this.userResource.skip = 0;
  //     }
  //     this.dataSource.loadUsers(this.userResource);
  //   });

  //   this.sub$.sink = this.phoneNumberSearchFilterCtl.valueChanges.pipe(
  //     debounceTime(400),
  //     distinctUntilChanged()
  //   ).subscribe(c => {
  //     this.userResource.phone_number = c;
  //     this.userResource.skip = 0;
  //     this.dataSource.loadUsers(this.userResource);
  //   });

  //   this.sub$.sink = this.isActiveSearchFilterCtl.valueChanges.pipe(
  //     debounceTime(400),
  //     distinctUntilChanged()
  //   ).subscribe(c => {
  //     this.userResource.is_active = c;
  //     this.userResource.skip = 0;
  //     this.dataSource.loadUsers(this.userResource);
  //   })

  }

  ngAfterViewInit() 
  {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
    .pipe
    (
      tap((c: any) => 
        {
          this.usuarioResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.usuarioResource.pageSize = this.paginator.pageSize;
          this.usuarioResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadUsers(this.usuarioResource);
        })
    )
    .subscribe();
  }

  deleteUser(usuario: Usuario) 
  {
    this.sub$.sink = this.commonDialogService
    .ConfirmationDialog(`Esta seguro que desea eliminar ${usuario.usuario}`)
    .subscribe((isTrue: boolean) => 
    {
      if (isTrue) 
      {
        this.sub$.sink = this.usuarioService.deleteUser(usuario.id ?? '')
        .subscribe(() => 
        {
          this.toastrService.success('Eliminado');
          this.paginator.pageIndex = 0;
          this.usuarioResource.name = this.input.nativeElement.value;
          this.dataSource.loadUsers(this.usuarioResource);
        });
      }
   });
  }

  editUser(userId: string) 
  {
    this.router.navigate(['/users/manage', userId])
  }

  userPermission(userId: string) 
  {
    this.router.navigate(['/users/permission', userId])
  }
}
