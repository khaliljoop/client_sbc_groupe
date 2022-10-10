import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecuriteService {
  private apiUrl=environment.baseUrl;
  public currentUrl = new BehaviorSubject<any>(undefined);

  constructor(private http:HttpClient,private router: Router) {
    
      this.router.events.subscribe({
         next:(v)=>{
          if (v instanceof NavigationEnd) {
            this.currentUrl.next(v.urlAfterRedirects);
        }
         }
      });
      //let menu: NavItem[] =[];
      /*let menu: NavItem[] = [
        {
          displayName: 'Dashboard',
          iconName: 'dashboard',
          route: 'dashboard'
        },
        {
          displayName: 'User',
          iconName: 'face',
          route: 'user',
          children: [
            {
              displayName: 'Account Info',
              iconName: 'account_box',
              route: 'user/account-info'
            }
          ]
        },
        {
          displayName: 'User',
          iconName: 'face',
          route: 'user',
          children: [
            {
              displayName: 'Account Info',
              iconName: 'account_box',
              route: 'user/account-info'
            }
          ]
        },
      ];*/
      
  }

  

  /***********************----------- tout element de la securite  --------------**********************************/
  public addElement(element:any,chemin?:string):Observable<any>{
    return this.http.post(`${this.apiUrl+chemin}`,element);
  }


  public getElenents(chemin:string): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl+chemin}`);
}

public getElementBy(chemin: String,obj?:any,param?:string): Observable<any>{
  return this.http.get<any>(`${this.apiUrl+chemin+'?'+param}=`+obj);
}
public getElementByElement(chemin: String,profil?:any): Observable<any>{
  return this.http.get<any>(`${this.apiUrl+chemin}/${profil}`);
}

public getElementsById(chemin: String,profil?:any): Observable<any[]>{
  return this.http.get<any[]>(`${this.apiUrl+chemin}/${profil}`);
}

public deleteElement(id: any,chemin:string):Observable<any>{
  return this.http.delete<any>(`${this.apiUrl+chemin}/${id}`);
}
 
}
