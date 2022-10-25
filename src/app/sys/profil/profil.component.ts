
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
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

 
  profil!:Profil;
  action!:Action;
  actions!:Action[];
  menuactions!:any[];
  profils!:Profil[];
  menus!:Menu[];
  smenus!:Smenu[];
  menu!:Menu;

  userForm!:FormGroup;
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
    this.userForm=this.formBuilder.group({
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
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }

  onSaveMenu(){
    const form=this.userForm.value;
    const profil=new Profil(
      form['code'],
      form['libelle'],
      form['etat']
    );
    this.securiteService.addElement(profil,'profil/add').subscribe({
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
    this.securiteService.getElementBy("getProfilById",id,'id').subscribe({
      next:(v)=>{
        if(v!=null)
        {
          this.profil=v;
          this.getActionByElemnt(this.profil.id_profil);
          console.log("id profil "+this.profil.id_profil);
        }
      }
    });
  }


}
