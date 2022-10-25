import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    private securiteService:SecuriteService
    ) { }
  users:Personne[]=[];
  personne!:Personne;
  profils:Profil[]=[];
  profile!:Profil;
  usersProfil:UserProfil[]=[];
  userForm! : FormGroup;


  ngOnInit(): void {
    this.getProfils();
    this.getUsers();
    
  }

  getProfils(){
          this.securiteService.getElenents("getProfils").subscribe({
            next:(p)=>{
              this.profils=p;
            }
          });
  }
  getUsers(){
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

  editeUser(id:any){
    
  }

  deleUser(id:any){

  }

  profil(uid:string){
    alert("unique id "+uid);
  }

  updateProfil(){}

  displayStyle = "none";
  
  openPopup(id:string) {
    this.compteService.getUserById(id).subscribe({
      next:(pers)=>{
        this.personne=pers;
      }
    });
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

}
