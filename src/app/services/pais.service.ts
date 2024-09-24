import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class PaisService {

    constructor(private _http: HttpClient) { }

    getPaises(): Observable<any> {
        return this._http.get('Pais/GetPais');
    }
}