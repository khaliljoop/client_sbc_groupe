import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Personne } from 'src/app/model/personne.model';
import { CompteService } from 'src/app/service/compte.service';
import { GlobalService } from 'src/app/service/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private compteService: CompteService,
    private router :Router) { }

    userForm! : FormGroup;
    username="";
    password="";
    user!:Personne;
    isLogin:Boolean=false;
    isSubmitted:Boolean=false;
    global!:GlobalService

  ngOnInit(): void {
    this.initForm();
  }

  connect(){
    this.router.navigateByUrl("/addmenu");
  }

  getUsername()
  {
    const formValue=this.userForm.value;
    const username=formValue['username'];
    const password=formValue['password'];
    this.isSubmitted=true
    this.compteService.getPersonneByUsername(username).subscribe(
      {
        next:(v)=>{
          if(v!=null){
            if(this.compteService.iScorrectPass(this.compteService.decrypt_pwd(v.password),password))
            {
              this.user=v;
              sessionStorage.setItem("unique_id", v.unique_id+"");
              sessionStorage.setItem("prenom", v.prenom+"");
              sessionStorage.setItem("nom", v.nom+"");
              //this.global.saveData(v.unique_id,v.prenom,v.nom)
              this.isLogin=true
              console.log("success")
              this.router.navigateByUrl("/");
            }
            else
            {
              this.isLogin=false
              //alert("username ou mot de passe incorrect");
            }
          }
          else
          {
            //alert("username ou mot de passe incorrect ");
          }
        },
        error:(e)=>alert("error serveur  "+e.message),
      }
      
    );
    
  }

  initForm(){
    this.userForm=this.formBuilder.group(
      {
        username:['',Validators.required],
        password:['',Validators.required],
      }
    );
  }


  public loginUser(): void{
    const formValue=this.userForm.value;
    const username=formValue['username'];
    const password=formValue['password'];
    console.log('username '+username+' pwd '+this.compteService.crypt_pwd(password));
    
    this.compteService.getPersonneByLogin(username,this.compteService.crypt_pwd(password)).subscribe(
     {
        next:(v)=>{
            if(v!=null)
            {
              this.user=v;
              sessionStorage.setItem("unique_id", v.unique_id);
              this.router.navigateByUrl("/accueil");
            }
            else
            {
              alert('veuillez verifiez votre mot de passe ou username !');
            }
        },
        error:(e)=>alert('Erreur de connexion  '+e.message),
      }
    );
  }

  displayStyle = "none";
  
  openPopup() {
    this.initForm()
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  
}
