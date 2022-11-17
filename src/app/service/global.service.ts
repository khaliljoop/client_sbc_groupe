import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Message } from '../model/message.model';
import { Personne } from '../model/personne.model';
import { CompteService } from './compte.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  modalRef?: BsModalRef;
  dismissible = true;
  search:string='';
  assistant:Personne=new Personne("","","","","","","","","","",0)
  listeMessages:Message[]=[]
  userFilter:Personne[]=[];
  allUsers:Personne[]=[];
  
  constructor(private cmptService:CompteService,private m_service:MessageService, private modalService?: BsModalService) {}
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService!.show(template);
  }

  /*saveData(uid:string,prenom:string,nom:string) {
    sessionStorage.setItem('uid',uid );
    sessionStorage.setItem('prenom',prenom);
    sessionStorage.setItem('nom', nom);
  }
  getData() {
    return sessionStorage.getItem('prenom');
  }*/



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

  getAssistant(){
    this.cmptService.getAssistant().subscribe({
      next:(p)=>{
        this.assistant=p
      }
    })
  }

  getMessageByUser(){
    this.m_service.getMessageByUid("getMessageByUid",sessionStorage.getItem('unique_id')+this.assistant.unique_id).subscribe({
      next:(ms)=>{
        this.listeMessages=[]
        this.listeMessages=ms

      }
    })
  }
}
