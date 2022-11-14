import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Toast, ToastrService } from 'ngx-toastr';
import { Mpagination } from 'src/app/model/param/mpagination.model';
import { Personne } from 'src/app/model/personne.model';
import { Profil } from 'src/app/model/sys/profil.model';
import { UserProfil } from 'src/app/model/sys/user-profil.model';
import { CompteService } from 'src/app/service/compte.service';
import { SecuriteService } from 'src/app/service/securite.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private compteService:CompteService,
    private formBuilder:FormBuilder,
    private securiteService:SecuriteService,
    private toast:ToastrService,
    private route:Router
    ) { }
  users:Personne[]=[];
  personne:Personne=new Personne("","","","","","","","","","",0);
  profils:Profil[]=[];
  profile!:Profil;
  id_profil:number=0;
  usersProfil:UserProfil[]=[];
  userForm! : FormGroup;


  search=""
  filterpers:UserProfil[]=[]
  List_filer:UserProfil[]=[]
  mpagination:Mpagination={
    tab_taille:0,
    nb_line:5,
    startItem:0,
    endItem:5,
    totalItems : this.filterpers.length
  }

  ngOnInit(): void {
    this.initForm();
    this.getProfils();
    this.getUsers();
    
  }

  initForm(){
    this.userForm=this.formBuilder.group(
      {
        user_profil:['',Validators.required],
      }
    );
  }

  getProfils(){
          this.securiteService.getElenents("getProfils").subscribe({
            next:(p)=>{
              this.profils=p;
            }
          });
  }
  getUsers(){
    this.usersProfil=[];
    this.compteService.getPersonnes().subscribe({
      next:(users)=>{
        this.users=users;
        
        for(let u of users){
          this.securiteService.getElementByElement("getProfilByUid",u.unique_id).subscribe({
            next:(p)=>{
              this.profile=p;
              this.usersProfil.push(new UserProfil(u,this.profile));
              this.mpagination.tab_taille=this.usersProfil.length
              this.filterpers=this.usersProfil.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line)
      
            }
          });
        }
      }
    });
  }

  editeUser(id:any){}

  deleUser(id:any){}

  profil(uid:string){
    alert("unique id "+uid);
  }

  updateProfil(id:any){
    var code=0;
    if(this.userForm.value['user_profil']!="")
    {
      code=this.userForm.value['user_profil']
      console.log("afficher profil "+this.userForm.value['user_profil']+" "+id)
    }
    else
      {
        code=this.id_profil;
        console.log("afficher profil id "+this.id_profil+" "+id)
      }
    
      this.securiteService.updateUser("updateUser",id,code).subscribe({
        next:(res)=>{
          if(res==1){
            this.toast.success("mise a jour reussi")
          }
          this.getUsers();
          this.toast.show("update","success");
          this.displayStyle = "none";
          this.route.navigate(['/users']);
        },
        error:(err)=> {
          this.toast.error("erreur "+err);
        },
      });
  }

  displayStyle = "none";
  openPopup(id:string,code:any) {
    this.id_profil=code;
    this.compteService.getUserById(id).subscribe({
      next:(pers)=>{
        this.personne=pers;
        console.log("prenom "+this.personne.prenom+" code "+code);
      }
    });
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }

  changeProfil(e:any) {
    console.log(e.target.value);
  }

  pageChanged(event: PageChangedEvent): void {
    this.mpagination.startItem = (event.page - 1) * event.itemsPerPage;
    this.mpagination.endItem = event.page * event.itemsPerPage;
    this.filterpers = this.usersProfil.slice(this.mpagination.startItem, this.mpagination.endItem);
  }

  onLineSelect()
  { 
    this.filterpers = this.usersProfil.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
  }
  filter(){
    
    if(this.search==''){
      this.mpagination.tab_taille=this.users.length
      this.filterpers=this.usersProfil.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line)
      
    }
    else{
      var _search=this.search.toLowerCase().split('é').join('e').split('è').join('e')
      this.filterpers=[]
      this.List_filer=[]
      for(let p of this.usersProfil){
        var prenom=p.personne.prenom.toLowerCase().split('é').join('e').split('è').join('e')
        var nom =p.personne.nom.toLowerCase().split('é').join('e').split('è').join('e')
        var adresse =p.personne.adresse.toLowerCase().split('é').join('e').split('è').join('e')
        var uid =p.personne.unique_id.toLowerCase().split('é').join('e').split('è').join('e')
        var code=p.profil.code.toLowerCase().split('é').join('e').split('è').join('e')
        var lib=p.profil.libelle.toLowerCase().split('é').join('e').split('è').join('e')
        var mail=p.personne.email.toLowerCase().split('é').join('e').split('è').join('e')
        if(prenom.includes(_search) || nom.includes(_search) || adresse.includes(_search) || uid.includes(_search) || code.includes(_search) || lib.includes(_search) || mail.includes(_search) )
        this.List_filer.push(p)
       
      }
      this.mpagination.tab_taille=this.List_filer.length
      this.filterpers = this.List_filer.slice(this.mpagination.startItem , this.mpagination.startItem+this.mpagination.nb_line);
    }
  }

}
