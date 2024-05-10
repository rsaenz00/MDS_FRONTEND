import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Blog } from '../models/blog.model';

@Injectable({
    providedIn: 'root'
})

export class BlogService {

    constructor(private _http: HttpClient) { }

    getBlogList(): Observable<any> {
        return this._http.get('Blogs/GetBlogs');
    }

    addBlog(data: Blog): Observable<Blog> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.post<Blog>('Blogs/AddBlog', datos, { headers: cabecera });
    }

    updateBlog(data: Blog): Observable<Blog> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.put<Blog>('Blogs/UpdateBlog', datos, { headers: cabecera });
    }

    deleteBlog(data: Blog): Observable<Blog> {
        const datos: string = JSON.stringify(data);
        let cabecera = new HttpHeaders();
        cabecera = cabecera.set('Content-Type', 'application/json');

        return this._http.delete<Blog>('Blogs/DeleteBlog', { headers: cabecera, body: datos });
    }
}