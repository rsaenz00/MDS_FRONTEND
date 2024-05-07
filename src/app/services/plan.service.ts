import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

var URI_API = "https://localhost:7162";

@Injectable({
    providedIn: 'root'
})

export class PlanService {

    constructor(private _http: HttpClient) { }

    GetPlanesList(): Observable<any> {
        return this._http.get(URI_API + '/Planes/GetPlanes');
    }

}