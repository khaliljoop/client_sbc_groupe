import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';
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
              console.log("llprofil "+p);
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

}
