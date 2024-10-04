import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { AmbulanciaResource } from 'src/app/models/resources/ambulancia-resource';
import { ResponseHeader } from 'src/app/models/resources/response-header';
import { HttpResponse } from '@angular/common/http';
import { HistoriaClinicaService } from 'src/app/services/historiaclinica.service';
import { HistoriaClinica } from 'src/app/models/historiaclinica.model';

export class AmbulanciaDataSource implements DataSource<HistoriaClinica> {
    //private ambulanciaSubject = new BehaviorSubject<Ambulancia[]>([]);
    private ambulanciaSubject = new BehaviorSubject<HistoriaClinica[]>([]);
    private responseHeaderSubject = new BehaviorSubject<ResponseHeader | null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private _count: number = 0;
    private _load: boolean = true;

    public get count(): number {
        return this._count;
    }

    public get load(): boolean {
        return this._load;
    }

    public responseHeaderSubject$ = this.responseHeaderSubject.asObservable();

    constructor(/*private ambulanciaService: AmbulanciaService, */private _historiaClinicaService: HistoriaClinicaService) { }

    //connect(): Observable<Ambulancia[]> {
    connect(): Observable<HistoriaClinica[]> {
        return this.ambulanciaSubject.asObservable();
    }

    disconnect(): void {
        this.ambulanciaSubject.complete();
        this.loadingSubject.complete();
    }

    loadAmbulancia(ambulanciaResource: AmbulanciaResource) {
        this.loadingSubject.next(true);
        this._count = 0;
        this._load = true;
        //this.ambulanciaService.getAmbulancia(ambulanciaResource)
        this._historiaClinicaService.GetHistoriasClinicasAmbulanciaList(ambulanciaResource)
            .pipe
            (
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe
            (
                //(resp: HttpResponse<Ambulancia[]> | any) => {
                (resp: HttpResponse<HistoriaClinica[]> | any) => {
                    //console.log(resp);
                    const paginationParam = JSON.parse(resp.headers.get('X-Pagination')) as ResponseHeader;
                    this.responseHeaderSubject.next(paginationParam);
                    const amnbulanciaTrails = [...resp.body.resultData.result];
                    this._count = amnbulanciaTrails.length;
                    this._load = false;
                    //console.log(amnbulanciaTrails);
                    this.ambulanciaSubject.next(amnbulanciaTrails);
                }
            );
    }
}