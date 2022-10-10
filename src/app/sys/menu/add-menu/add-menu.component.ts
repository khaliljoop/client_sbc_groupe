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
  
  isAddClicked!:boolean;
  isCancelClicked!:boolean;

  ngOnInit(): void {
    this.initForm();
    this.getElenents("getMenus");
    this.isAddClicked=false;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  initForm()
  {
    this.userForm=this.formBuilder.group({
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
    const menu=new Menu(
      form['code'],
      form['libelle'],
      form['etat']
    );
    this.securiteService.addElement(menu,'menu/add').subscribe({
      next:(v)=>{
       // this.toast.show("ajout menu","nouveau menu");
        this.initForm();
        this.getElenents("getMenus");
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
