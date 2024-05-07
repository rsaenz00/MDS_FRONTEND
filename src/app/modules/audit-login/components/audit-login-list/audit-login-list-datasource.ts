import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, catchError, finalize, of } from "rxjs";
import { AuditLogin } from "src/app/models/audit-login";
import { AuditLoginResource } from "src/app/models/resources/audit-login-resource";
import { ResponseHeader } from "src/app/models/resources/response-header";
import { AuditLoginService } from "src/app/services/audit-login.service";
import { HttpResponse } from '@angular/common/http';

export class AuditLoginListDataSource implements DataSource<AuditLogin> 
{
    private auditLoginSubject = new BehaviorSubject<AuditLogin[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader|null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;

    public get count(): number 
    {
        return this._count;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(private auditLoginService: AuditLoginService) { }

    connect(): Observable<AuditLogin[]> 
    {
        return this.auditLoginSubject.asObservable();
    }

    disconnect(): void 
    {
        this.auditLoginSubject.complete();
        this.loadingSubject.complete();
    }

    loadLoginAudits(loginAuditResource: AuditLoginResource) 
    {
        this.loadingSubject.next(true);
        this.auditLoginService.getLoginAudits(loginAuditResource)
        .pipe
        (
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe
        (
            (resp: HttpResponse<AuditLogin[]> | any) => 
            {
                const paginationParam = JSON.parse(resp.headers.get('X-Pagination')) as ResponseHeader;
                this.responseHeaderSubject.next(paginationParam);
                const loginAuditTrails = [...resp.body];
                this._count = loginAuditTrails.length;
                this.auditLoginSubject.next(loginAuditTrails);
            }
        );
    }
}