
import { Component,OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { menu } from 'src/app/model/menu';
//import { ToastrService } from 'ngx-toastr';
import { Action } from 'src/app/model/sys/action.model';
import { Menu } from 'src/app/model/sys/menu.model';
import { Profil } from 'src/app/model/sys/profil.model';
import { Smenu } from 'src/app/model/sys/smenu.model';
import { SecuriteService } from 'src/app/service/securite.service';

@Component({
  selector: 'app-add-smenu',
  templateUrl: './add-smenu.component.html',
  styleUrls: ['./add-smenu.component.scss'],
  //encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b3c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `]

})
export class AddSmenuComponent implements OnInit {
  
  constructor(private modalService: BsModalService,private securiteService:SecuriteService,private formBuilder:FormBuilder,private route:Router) { }//private toast:ToastrService,
  /****************** */
  contentArray: string[] = new Array(50).fill('');
   returnedArray!: string[];
   showBoundaryLinks: boolean = true;
   showDirectionLinks: boolean = true;
  modalRef?: BsModalRef;
  dismissible = true;
  /******************** */
  closeResult: string="";
  str!:string;
  smenus!:Smenu[];
  profils!:Profil[];
  menus!:Menu[];
  idmenu!: Menu;
  smenu:Smenu={
    id_smenu:0,
    id_menu:0,
    code:'',
    libelle:'',
    etat:-1,
    route:''
  }
  
  private adminAction=1;
  private defaultAction=-1;
  //@Input() menu!:Menu;
  userForm!:FormGroup;

  isAddClicked!:boolean;
  isSaveAdsmenu!:boolean;
  isCancelClicked!:boolean;
  menuSelected!:string;
  ngOnInit(): void {
    this.initForm();
    this.getElenents("getSmenus");
    this.getElenentsP("getProfils");
    this.isAddClicked=false;
    this.isSaveAdsmenu=false;
    this.contentArray = this.contentArray.map((v: string, i: number) => {
      return 'Line '+ (i + 1);
   });
   this.returnedArray = this.contentArray.slice(0, 5);
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
 }

  openModal(template: TemplateRef<any>) {
    this.isAddClicked=true;
    this.getElenentsM("getMenus");
    this.modalRef = this.modalService.show(template);
  }
  
  getMenuById(id:any){
    this.securiteService.getElementBy("getMenuById",id,"id").subscribe({
      next:(m)=>{
        this.idmenu=m;
      }
    });
    return this.idmenu.libelle;
  }

  initForm()
  {
    this.userForm=this.formBuilder.group({
      id_smenu:[0],
      id_menu:[0],
      code:['',Validators.required],
      libelle:['',Validators.required],
      etat:['1'],
      def:['-1']
    });
  }

  getElenents(chemin:string)
  {
    this.securiteService.getElenents(chemin).subscribe({
      next:(v)=>{
        this.smenus=v;
      
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }

  getElenentsM(chemin:string)
  {
    this.securiteService.getElenents(chemin).subscribe({
      next:(v)=>{
        this.menus=v;
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }

  getElenentsP(chemin:string)
  {
    this.securiteService.getElenents(chemin).subscribe({
      next:(v)=>{
        this.profils=v;
      },
      error:(e)=>alert("erreur de recuperation "+e.message),
    });
  }

  onSaveSmenu(){
    const form=this.userForm.value;
    this.smenu.id_smenu=form['id_smenu'];
    this.smenu.code=form['code'];
    this.smenu.id_menu=form['id_menu'];
    this.smenu.libelle=form['libelle'];
    this.smenu.etat=form['etat'];
    //this.onSaveAction(smenu);
    console.log("id_menu_verifi ",form['id_menu'],);
    this.securiteService.addElement(this.smenu,'smenu/add').subscribe({
      next:(v)=>{
        this.onSaveAction(v.id_smenu,form['etat'],form['def']);
        console.log("msenu id verifi ",v.id_smenu);
        this.initForm();
        this.getElenents("getSmenus");
        //this.toast.success("Sous menu ajout avec succès");
        this.route.navigate(["/addsmenu"]);
      },
      error:(e)=>{
        alert('erreur d\'ajout:'+e.message);
      }
    });
  }
  get menu()
  {
    return this.userForm.get('id_menu');
  }
  onMenuSelect()
  { 
  }

  onSaveAction(smenu:any,a:any,d?:any){
    
    for(let i of this.profils)
    {
      //let action=new Profil();
      if(i.code=="ADMIN")
      {
        let action =new Action(i.id_profil,smenu,a,a,a,a);
        this.securiteService.addElement(action,'action/add').subscribe
        ({
            next:(v)=>{
            console.log("info profil id ==> "+i.id_profil+" menu did "+smenu);
          },
            error:(e)=>{
              console.log("info erreur ==> "+action.d_add);
            }
        });

      }
      else{
        let action =new Action(i.id_profil,smenu,d,d,d,d);
        this.securiteService.addElement(action,'action/add').subscribe
        ({
          next:(v)=>{console.log("no admin info profil id ==> "+i.id_profil+" menu did "+smenu);},
          error:(e)=>{
            console.log("info erreur ==> "+action.d_add);
          }
        });
      }

    }
  }

  addClicked()
  {
    this.getElenentsM("getMenus");
    this.isAddClicked=true;
  }
  returnClicked()
  {
    this.isAddClicked=false;
  }

  deleSmenu(id:any)
  {
    this.securiteService.deleteElement(id,'delete_smenu').subscribe({
      next:(v)=>{//delete_action_sm
        this.securiteService.deleteElement(id,"delete_action_sm").subscribe({
          next:(res)=>{
            this.getElenents("getSmenus");
            this.getElenentsP("getProfils");
            console.log("del rest "+res);
          },
          error:(er)=>{
            alert("errrrrreur de supp action "+er.message);
          }
        });
        this.getElenents("getSmenus");
        this.getElenentsP("getProfils");
        
      },
      error:(e)=>{
        alert('erreur de suppression');
      }
    });
  }

  edite_smenu(id:any,template: TemplateRef<any>){
    this.securiteService.getElementById("getSMenuById",id).subscribe({
      next:(sm)=>{
        this.userForm.controls['id_smenu'].setValue(sm.id_smenu);
        this.userForm.controls['id_menu'].setValue(sm.id_menu);
        this.userForm.controls['code'].setValue(sm.code);
        this.userForm.controls['libelle'].setValue(sm.libelle);
        this.userForm.controls['etat'].setValue(sm.etat);
        console.log("id_menu "+sm.id_menu);
      }
    });
    this.isAddClicked=false;
    this.modalRef = this.modalService.show(template);
  }
}
