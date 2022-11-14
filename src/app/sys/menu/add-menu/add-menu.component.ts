import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Mpagination } from 'src/app/model/param/mpagination.model';
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

    search=""
    filtermenus:Menu[]=[]
    List_filer:Menu[]=[]
    mpagination:Mpagination={
      tab_taille:0,
      nb_line:5,
      startItem:0,
      endItem:5,
      totalItems : this.filtermenus.length
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
        this.mpagination.tab_taille=this.menus.length
        this.filtermenus = this.menus.slice(this.mpagination.startItem, this.mpagination.endItem);
        
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

  pageChanged(event: PageChangedEvent): void {
    this.mpagination.startItem = (event.page - 1) * event.itemsPerPage;
    this.mpagination.endItem = event.page * event.itemsPerPage;
    this.filtermenus = this.menus.slice(this.mpagination.startItem, this.mpagination.endItem);
  }

  onLineSelect()
  { 
    this.filtermenus = this.menus.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
  }
  filter(){
    
    if(this.search==''){
      this.filtermenus=this.menus.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line)
      this.mpagination.tab_taille=this.menus.length
    }
    else{
      var _search=this.search.toLowerCase().split('é').join('e').split('è').join('e')
      this.filtermenus=[]
      this.List_filer=[]
      for(let p of this.menus){
        var lib=p.libelle.toLowerCase().split('é').join('e').split('è').join('e')
        var code_v =p.code.toLowerCase().split('é').join('e').split('è').join('e')
        if(lib.includes(_search) || code_v.includes(_search) )
        this.List_filer.push(p)
       
      }
      this.mpagination.tab_taille=this.List_filer.length
      this.filtermenus = this.List_filer.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
    }
  }

}//delete_smenu_menu
