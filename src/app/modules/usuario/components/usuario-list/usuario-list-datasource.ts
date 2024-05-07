import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { ResponseHeader } from 'src/app/models/resources/response-header';
import { UsuarioResource } from 'src/app/models/resources/usuario-resource';
import { Usuario } from "src/app/models/usuario";
import { UsuarioService } from 'src/app/services/usuario.service';
import { HttpResponse } from '@angular/common/http';

export class UsuarioListDataSource implements DataSource<Usuario> 
{
    private userSubject = new BehaviorSubject<Usuario[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader|null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;

    public get count(): number 
    {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private usuarioService: UsuarioService) { }

    connect(): Observable<Usuario[]> 
    {
        return this.userSubject.asObservable();
    }

    disconnect(): void 
    {
        this.userSubject.complete();
        this.loadingSubject.complete();
    }

    loadUsers(usuarioResource: UsuarioResource) 
    {
        this.loadingSubject.next(true);
        this.usuarioService.getUsers(usuarioResource).pipe
        (
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false)))
            .subscribe((resp: HttpResponse<Usuario[]> | any) => 
            {
                const paginationParam = JSON.parse(resp.headers.get('X-Pagination')) as ResponseHeader;
                this.responseHeaderSubject.next(paginationParam);
                const users = [...resp.body];
                this._count = users.length;
                this.userSubject.next(users);
            }
        );
    }
}