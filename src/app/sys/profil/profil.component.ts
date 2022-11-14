
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Mpagination } from 'src/app/model/param/mpagination.model';
//import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/model/sys/action.model';
import { Menu } from 'src/app/model/sys/menu.model';
import { Menuaction } from 'src/app/model/sys/menuaction.model';
import { Profil } from 'src/app/model/sys/profil.model';
import { Smenu } from 'src/app/model/sys/smenu.model';
import { SecuriteService } from 'src/app/service/securite.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})

export class ProfilComponent implements OnInit {
  constructor(
    private formBuilder:FormBuilder,
    private securiteService:SecuriteService,
    //private toast:ToastrService,
    private router: Router
    ) { }

 
  search=""
  filterprofils:Profil[]=[]
  List_filer:Profil[]=[]
  pageReturn?:Profil[];
  
  profil!:Profil;
  mpagination:Mpagination={
    tab_taille:0,
    nb_line:5,
    startItem:0,
    endItem:5,
    totalItems : this.filterprofils.length
  }
  action!:Action;
  actions!:Action[];
  menuactions!:any[];
  profils!:Profil[];
  menus!:Menu[];
  smenus!:Smenu[];
  menu!:Menu;
  p_profil:Profil={
    id_profil:0,
    code:'',
    libelle:'',
    etat:-1
  }

  profilForm!:FormGroup;
  isSelectLine!:boolean;
  isUpdate!:boolean;
  ismenuclick!:boolean;
  isAddClicked!:boolean;
  isCancelClicked!:boolean;

  ngOnInit(): void {
    this.initForm();
    this.getElenents("getProfils");
    this.isAddClicked=false;
    this.isUpdate=false;
    this.ismenuclick=false;
    this.isSelectLine=false;
    this.securiteService.getElenents("getMenus").subscribe({
      next:(v)=>{
        this.menus=v;
      }
    });
    this.getSmenu();
  }

  initForm()
  {
    this.profilForm=this.formBuilder.group({
      id_profil:[0],
      code:['',Validators.required],
      libelle:['',Validators.required],
      etat:['1']
    });
  }

  isSelectLineClick(){
    this.isSelectLine=true;
  }

  getElenents(chemin:string)
  {
    this.securiteService.getElenents(chemin).subscribe({
      next:(v)=>{
        this.profils=v;
        this.mpagination.tab_taille=this.profils.length
        this.filterprofils = this.profils.slice(this.mpagination.startItem, this.mpagination.endItem)
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }

  onSaveMenu(){
    const form=this.profilForm.value;
    this.p_profil.id_profil=form['id_profil'];
    this.p_profil.code=form['code'];
    this.p_profil.libelle=form['libelle'];
    this.p_profil.etat=form['etat'];
    this.securiteService.addElement(this.p_profil,'profil/add').subscribe({
      next:(v)=>{
       // alert('Ajout avec succès');
       //this.toast.success("Ajout avec succès");
       //this.toast.show("Enregistrement reussi","Nouveau profil");
        this.initForm();
        this.getElenents("getProfils");
        this.router.navigate(['/profil']);
      },
      error:(e)=>{
        alert('erreur d\'ajout:'+e.message);
      }
    });
  }

  getSmenu(){
    this.securiteService.getElenents("getSmenus").subscribe({
      next:(v)=>{
        this.smenus=v;
        console.log("param",v);
      }
    });
  }
  getMenuById(id:number)
  {
    this.securiteService.getElementBy("getMenuById",id,'id').subscribe({
      next:(v)=>{
        console.log(" liste menu by id ",v);
        this.menu=v;
        this.ismenuclick=true;
        this.securiteService.getElementsById("getSMenusByIdmenu",id).subscribe
        ({
          next:(smenus)=>{
            if(smenus!=null)
            {
              this.smenus=smenus;
              var tab=[];
              for(let sm of this.smenus)
                {
                  console.log("sm menu liste ",this.menu.smenu);
                  
                  for (let action of this.actions)
                  {
                    console.log("actions liste ",this.actions);
                    if(sm.id_smenu==action.id_smenu)
                    {
                    
                    console.log("element liste action menu ",new Menuaction(
                      action.id_action,
                      action.id_profil,
                      action.id_smenu,
                      sm.libelle,
                      action.d_read,
                      action.d_add,
                      action.d_update,
                      action.d_del
                    ));
                      tab.push(new Menuaction(
                        action.id_action,
                        action.id_profil,
                        action.id_smenu,
                        sm.libelle,
                        action.d_read,
                        action.d_add,
                        action.d_update,
                        action.d_del
                      ));
                    }
                  }
                }
                this.menuactions=tab;

            }
          }

        });
        

        console.log("list menu action ",this.menuactions," length ")

      }
    });
  }
  onDeleteClient(id:any)
  {
    //delete_smenu/
    this.securiteService.deleteElement(id,"delete_profil").subscribe({
      next:(v)=>{
        console.log("rest delete "+v);
        this.getElenents("getProfils");
        this.getSmenu();
      },
      error:(e)=>{
        console.log("rest delete erreur "+e);
      }
    });
  }
  onCheckItem(e:any)
  {
    if(e.target.checked){
      this.isSelectLine=true;
    }
    else
    {
      this.isSelectLine=false;
    }

  }
  addClicked()
  {
    this.isAddClicked=true;
  }
  returnClicked()
  {
    this.isAddClicked=false;
    this.isUpdate=false;
    this.ismenuclick=false;
    
    this.getElenents("getProfils");
  }
  isUpdateClicked()
  {
    this.isUpdate=true;
  }

  getActionByElemnt(profil:any)
  {
      this.securiteService.getElementsById("getActionByProfil",profil).subscribe({
        next:(v)=>{
          this.actions=v;
          console.log("idiiii "+this.actions[0].id_action+" taille "+this.actions.length);
          console.log("Actions "+v);
          /*for(let a of this.actions)
          {
           console.log("smenu "+a.id_smenu+" add "+a.d_add+" supp "+a.d_del);
          }*/
        }
      });
    
  }
  getRoles(id:any)
  {
    this.isUpdate=true;
    this.securiteService.getElementById("getProfilById",id).subscribe({
      next:(v)=>{
        if(v!=null)
        {
          this.profil=v;
          this.getActionByElemnt(this.profil.id_profil);
          console.log("id profil "+this.profil.id_profil);
        }
      }
    });
    this.displayStyle1 = "block";
  }

  edite_profil(id:any){
    this.securiteService.getElementById("getProfilById",id).subscribe({
      next:(p)=>{
        this.profilForm.controls['id_profil'].setValue(p.id_profil);
        this.profilForm.controls['code'].setValue(p.code);
        this.profilForm.controls['libelle'].setValue(p.libelle);
        this.profilForm.controls['etat'].setValue(p.etat);
        console.log("lib profil "+p.libelle);
      },
      error:(e)=>{}
    });
    this.isAddClicked=false;
    this.displayStyle = "block";
  }

  displayStyle = "none";
  displayStyle1 = "none";

  openPopup() {
    this.isAddClicked=true;
    this.initForm();
    this.displayStyle = "block";
  }
  closePopup() {
    this.ngOnInit();
    this.router.navigate(['/profil']);
    this.displayStyle = "none";
    this.displayStyle1 = "none";
  }

  pageChanged(event: PageChangedEvent): void {
    this.mpagination.startItem = (event.page - 1) * event.itemsPerPage;
    this.mpagination.endItem = event.page * event.itemsPerPage;
    this.filterprofils = this.profils.slice(this.mpagination.startItem, this.mpagination.endItem);
  }

  onLineSelect()
  { 
    this.filterprofils = this.profils.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
  }
  filter(){
    
    if(this.search==''){
      this.filterprofils=this.profils.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line)
      this.mpagination.tab_taille=this.profils.length
    }
    else{
      var _search=this.search.toLowerCase().split('é').join('e').split('è').join('e')
      this.filterprofils=[]
      this.List_filer=[]
      for(let p of this.profils){
        var lib=p.libelle.toLowerCase().split('é').join('e').split('è').join('e')
        var code_v =p.code.toLowerCase().split('é').join('e').split('è').join('e')
        if(lib.includes(_search) || code_v.includes(_search) )
        this.List_filer.push(p)
      }
      this.mpagination.tab_taille=this.List_filer.length
      this.filterprofils = this.List_filer.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
    }
  }


}
