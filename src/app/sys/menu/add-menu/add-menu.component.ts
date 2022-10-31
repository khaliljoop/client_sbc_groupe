import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { ToastrService } from 'ngx-toastr';
import { Menu } from 'src/app/model/sys/menu.model';
import { GlobalService } from 'src/app/service/global.service';
import { SecuriteService } from 'src/app/service/securite.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss'],
  //providers: [NgbPaginationConfig]
})

export class AddMenuComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private securiteService:SecuriteService,
   // private toast:ToastrService,
    private route:Router,
    private modalService: BsModalService,
    //private config: NgbPaginationConfig
    ) { 
     // this.config.size = 'sm';
    //this.config.boundaryLinks = true;
    }
    
  modalRef?: BsModalRef;
  dismissible = true;
  str!:string;
  menus!:Menu[];
  userForm!:FormGroup;
  menu:Menu={
    id_menu:0,
    code:'',
    libelle:'',
    etat:-1,
    smenu:[],
    disabled:false,
    route:''

  }
  
  isAddClicked!:boolean;
  isCancelClicked!:boolean;

  ngOnInit(): void {
    this.initForm();
    this.getElenents("getMenus");
    this.isAddClicked=false;
  }

  closeModal(){
    this.ngOnInit();
    this.route.navigate(['/addmenu']);
    this.modalRef?.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.isAddClicked=true;
    this.modalRef = this.modalService.show(template);
  }

  initForm()
  {
    this.userForm=this.formBuilder.group({
      id_menu:[0],
      code:['',Validators.required],
      libelle:['',Validators.required],
      etat:['1']
    });
  }

  getElenents(chemin:string)
  {
    this.securiteService.getElenents(chemin).subscribe({
      next:(v)=>{
        this.menus=v;
        console.log("menu : "+this.menus.length);
        console.log("menu s : "+v.length)
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }
  onSaveMenu(){
    const form=this.userForm.value;
    this.menu.id_menu=form['id_menu'];
    this.menu.code=form['code'];
    this.menu.libelle=form['libelle'];
    this.securiteService.addElement(this.menu,'menu/add').subscribe({
      next:(v)=>{
       // this.toast.show("ajout menu","nouveau menu");
       this.ngOnInit();
        this.route.navigate(["/addmenu"]);
      },
      error:(e)=>{
        alert('erreur d\'ajout:'+e.message);
      }
    });
  }

  addClicked()
  {
    this.isAddClicked=true;
  }
  returnClicked()
  {
    this.isAddClicked=false;
    this.getElenents("getMenus");
  }
  edite_menu(id:any,template: TemplateRef<any>){
    this.isAddClicked=false;
    this.securiteService.getElementById("getMenuById",id).subscribe({
      next:(m)=>{
        this.userForm.controls['id_menu'].setValue(m.id_menu);
        this.userForm.controls['code'].setValue(m.code);
        this.userForm.controls['libelle'].setValue(m.libelle);
        this.userForm.controls['etat'].setValue(m.etat);
        console.log("lib menu "+m.libelle);
      },
      error:(e)=>{

      }
    });
      this.modalRef = this.modalService.show(template);
  }

  deleMenu(id:any)
  {
    this.securiteService.deleteElement(id,'delete_menu').subscribe({
      next:(v)=>{
        this.securiteService.deleteElement(id,'delete_smenu_menu').subscribe({
          next:(res)=>{
            this.getElenents("getMenus");
            console.log("del rest "+res);
          },
          error:(er)=>{
            alert('erreur de suppression sm '+er.message);
          }
        });
        this.getElenents("getMenus");
      },
      error:(e)=>{
        alert('erreur de suppression');
      }
    });
  }

}//delete_smenu_menu
