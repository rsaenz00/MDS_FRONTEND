import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { UsuarioManageComponent } from '../usuario-manage/usuario-manage.component';
import { UsuarioAuth } from 'src/app/models/usuario-auth';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class UsuarioListComponent extends BaseComponent implements OnInit, AfterViewInit {
  usuarioEnlinea: UsuarioAuth;

  dataSource: UsuarioListDataSource;
  usuarios: Usuario[] = [];
  usuario: Usuario = {} as Usuario;
  usuarioResource: UsuarioResource;
  displayedColumns: string[] = ['usuario', 'nombres', 'numero_documento', 'email', 'estado', 'accion'];

  footerToDisplayed: string[] = ["footer"];
  isLoadingResults = true;
  loading$: Observable<boolean>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  usuarioFilterCtl: UntypedFormControl = new UntypedFormControl('');
  nombresFilterCtl: UntypedFormControl = new UntypedFormControl('');
  emailFilterCtl: UntypedFormControl = new UntypedFormControl('');
  numeroDocumentoFilterCtl: UntypedFormControl = new UntypedFormControl('');

  constructor
    (
      private usuarioService: UsuarioService,
      private toastrService: ToastrService,
      private commonDialogService: CommonDialogService,
      private dialog: MatDialog,
      private router: Router,
      private _dialog: MatDialog,
      private _usuarioService: UsuarioService
      // private translationService: TranslationService
    ) {
    super();
    this.usuarioResource = new UsuarioResource();
    this.usuarioResource.pageSize = 10;
    this.usuarioResource.orderBy = 'usuario desc'
    this.usuarioResource.email = 'ALL';
    this.usuarioResource.numero_documento = 'ALL';
    this.usuarioResource.persona = 'ALL';
    this.usuarioResource.usuario = 'ALL';
  }

  ngOnInit(): void {
    this.usuarioEnlinea = JSON.parse(localStorage.getItem('authObj') as any);
    this.dataSource = new UsuarioListDataSource(this.usuarioService);
    this.dataSource.loadUsers(this.usuarioResource);
    this.getResourceParameter();
    this.filterLogic();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader | any) => {
        if (c) {
          this.usuarioResource.pageSize = c.pageSize;
          this.usuarioResource.skip = c.skip;
          this.usuarioResource.totalCount = c.totalCount;
        }
      });
  }

  resetPassword(usuario: Usuario): void {
    this.dialog.open
      (
        UsuarioResetPasswordComponent,
        {
          width: '350px',
          data: Object.assign({}, usuario)
        }
      );
  }

  filterLogic() {
    this.sub$.sink = this.usuarioFilterCtl.valueChanges.pipe
      (
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe
      (
        c => {
          this.usuarioResource.usuario = c == '' ? 'ALL' : c;
          this.usuarioResource.skip = 0;
          this.dataSource.loadUsers(this.usuarioResource);
        }
      );

    this.sub$.sink = this.nombresFilterCtl.valueChanges.pipe
      (
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe
      (
        c => {
          this.usuarioResource.persona = c == '' ? 'ALL' : c;
          this.usuarioResource.skip = 0;
          this.dataSource.loadUsers(this.usuarioResource);
        }
      );

    this.sub$.sink = this.numeroDocumentoFilterCtl.valueChanges.pipe
      (
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe
      (
        c => {
          this.usuarioResource.numero_documento = c == '' ? 'ALL' : c;
          this.usuarioResource.skip = 0;
          this.dataSource.loadUsers(this.usuarioResource);
        }
      );

    this.sub$.sink = this.emailFilterCtl.valueChanges.pipe
      (
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe
      (
        c => {
          this.usuarioResource.email = c == '' ? 'ALL' : c;
          this.usuarioResource.skip = 0;
          this.dataSource.loadUsers(this.usuarioResource);
        }
      );
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe
      (
        tap((c: any) => {
          this.usuarioResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.usuarioResource.pageSize = this.paginator.pageSize;
          this.usuarioResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadUsers(this.usuarioResource);
        })
      )
      .subscribe();
  }

  deleteUser(usuario: Usuario) {
    /*this.sub$.sink = this.commonDialogService
      .ConfirmationDialog(`Esta seguro que desea eliminar ${usuario.usuario}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.usuarioService.DeleteUser(usuario.id ?? '')
            .subscribe(() => {
              this.toastrService.success('Eliminado');
              this.paginator.pageIndex = 0;
              this.usuarioResource.name = this.input.nativeElement.value;
              this.dataSource.loadUsers(this.usuarioResource);
            });
        }
      });*/
  }

  editarUsuario(userId: string, personaId: string) {
    const dialogRef = this._dialog.open(UsuarioManageComponent, {
      panelClass: 'sanna_theme',
      data: { 'userId': userId, 'personaId': personaId },
      width: '420px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new UsuarioListDataSource(this.usuarioService);
      this.dataSource.loadUsers(this.usuarioResource);
      this.getResourceParameter();
    });
  }

  userPermission(userId: string) {
    this.router.navigate(['/users/permission', userId])
  }

  openGestionUsuarioDialog() {
    const dialogRef = this._dialog.open(UsuarioManageComponent, {
      panelClass: 'sanna_theme',
      data: { 'userId': null },
      width: '420px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dataSource = new UsuarioListDataSource(this.usuarioService);
      this.dataSource.loadUsers(this.usuarioResource);
      this.getResourceParameter();
    });
  }

  activarUsuario(id_usuario: number, usuario: string) {
    this.usuario.id_persona = id_usuario.toString();
    this.usuario.usuario_creacion = this.usuarioEnlinea.id?.toString() || '';

    this._usuarioService.ActivarUsuario(this.usuario).subscribe({
      next: (res: any) => {
        this.toastrService.success('¡Se ha activado el usuario: ' + usuario + ' de forma satisfactoria!');
        this.dataSource = new UsuarioListDataSource(this.usuarioService);
        this.dataSource.loadUsers(this.usuarioResource);
        this.getResourceParameter();
      },
      error: (err: any) => {
        this.toastrService.error('¡No se ha podido activar el usuario!');
        console.error(err);
      },
    });
  }

  desactivarUsuario(id_usuario: number, usuario: string) {
    this.usuario.id_persona = id_usuario.toString();
    this.usuario.usuario_creacion = this.usuarioEnlinea.id?.toString() || '';

    this._usuarioService.DescativarUsuario(this.usuario).subscribe({
      next: (res: any) => {
        this.toastrService.success('¡Se ha desactivado el usuario: ' + usuario + ' de forma satisfactoria!');
        this.dataSource = new UsuarioListDataSource(this.usuarioService);
        this.dataSource.loadUsers(this.usuarioResource);
        this.getResourceParameter();
      },
      error: (err: any) => {
        this.toastrService.error('¡No se ha podido desactivar el usuario!');
        console.error(err);
      },
    });
  }

}