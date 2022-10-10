import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Image } from '../model/image.model';
import { Vehicule } from '../model/vehicule.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {

  private baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(chemin:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl+chemin}`);
  }
  create(list:any[],data: any,chemin:string): Observable<any> {
    return this.http.post(`${this.baseUrl+chemin}`, list,data);
  }

  createimg(data: any,chemin:string): Observable<any> {
    return this.http.post(`${this.baseUrl+chemin}`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: any,chemin:string): Observable<any> {
    return this.http.delete(`${this.baseUrl+chemin}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.baseUrl);
  }

  findById(url:any,id: any): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.baseUrl+url}/${id}`);
  }
}
