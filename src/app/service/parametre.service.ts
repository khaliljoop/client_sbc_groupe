import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable , Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  private apiUrl=environment.baseUrl;
  public currentUrl = new BehaviorSubject<any>(undefined);

  constructor(private http:HttpClient,private router: Router) { }

  /***********************----------- tout element paarametrage --------------**********************************/
  public addParametre(element:any,chemin?:string):Observable<any>{
    return this.http.post(`${this.apiUrl+chemin}`,element);
  }

  public getParametres(chemin:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl+chemin}`);
}
}
