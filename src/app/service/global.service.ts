import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Personne } from '../model/personne.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  modalRef?: BsModalRef;
  dismissible = true;
  search:string='';
  userFilter:Personne[]=[];
  allUsers:Personne[]=[];
  constructor(private modalService: BsModalService) {}
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  saveData(uid:string,prenom:string,nom:string) {
    sessionStorage.setItem('uid',uid );
    sessionStorage.setItem('prenom',prenom);
    sessionStorage.setItem('nom', nom);
  }
  getData() {
    return sessionStorage.getItem('prenom');
  }

  filter(){
    if(this.search==''){
      this.userFilter=this.allUsers;
    }
    else{
      var _search=this.search.toLowerCase().split('é').join('e').split('è').join('e')
      this.userFilter=[]
      for(let user of this.allUsers){
        var prenom=user.prenom.toLowerCase().split('é').join('e').split('è').join('e')
        var nom =user.nom.toLowerCase().split('é').join('e').split('è').join('e')
        if(prenom.includes(_search) || nom.includes(_search))
        this.userFilter.push(user)
      }
    }
  }
}
