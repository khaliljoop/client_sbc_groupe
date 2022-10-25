import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Personne } from '../model/personne.model';
import * as CryptoJS from 'crypto-js'; 

@Injectable({providedIn: 'root'})
export class CompteService {

userSubject = new Subject<any[]>();
private apiServiceUrl=environment.baseUrl;
private key='kh@00lil';
private unique_id="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
public isAuth=false;
constructor (private http:HttpClient){}


public getPersonnes(): Observable<Personne[]>{
    return this.http.get<Personne[]>(`${this.apiServiceUrl}getPersonnes`);
}

public addPersonne(personne: any): Observable<any>{
    return this.http.post(`${this.apiServiceUrl}personne/add`, personne);
}

public becomeAgent(idpers: String, personne: Personne): Observable<Personne>{
    return this.http.put<Personne> (`${this.apiServiceUrl}/personnes/`+idpers, personne);
}

public getPersonneByLogin(login: String, pwd: String): Observable<Personne>{
    return this.http.get<Personne>(`${this.apiServiceUrl}personne/findLogin?username=`+login+`&password=`+pwd);
}

public getPersonneByUsername(u: String): Observable<Personne>{
    return this.http.get<Personne>(`${this.apiServiceUrl}getLoginPersonne?username=`+u);
}


public getUserById(idpers: String): Observable<Personne>{
  return this.http.get<Personne>(`${this.apiServiceUrl}personne/`+idpers);
}
/**
 * pour controler l'acces direct des appareil
 * c'est une facon de controle
 */
 emetSubjectUser()
 {
   //this.userSubject.next(this.listeUser.slice());
 }


/************************    SECURITY      **************************** */

crypt_pwd(pass:string)
{
  return CryptoJS.AES.encrypt(pass.trim(), this.key.trim()).toString();  
}
decrypt_pwd(pass:string)
{
  return CryptoJS.AES.decrypt(pass.trim(), this.key.trim()).toString(CryptoJS.enc.Utf8);
}

iScorrectPass(pssClaire:string,passDecrypted:string)
{
  if(pssClaire==passDecrypted)
    return true;
  else
    return false;
}

generateKey(t:number)
{
    let text="";
    for(let i=0;i<t;i++)
    {
      text+=this.unique_id.charAt(Math.floor(Math.random()*this.unique_id.length))
    }
    return text;
}

}
