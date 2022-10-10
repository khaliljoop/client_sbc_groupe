import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Personne } from 'src/app/model/personne.model';
import { CompteService } from 'src/app/service/compte.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-count',
  templateUrl: './create-count.component.html',
  styleUrls: ['./create-count.component.scss']
})
export class CreateCountComponent implements OnInit {

  constructor(private compteService:CompteService,
              private formBuilder:FormBuilder,
              private route :Router) { }
 
  public userForm! : FormGroup;
  ngOnInit(): void {
    this.initForm();
  }


  initForm(){
    this.userForm=this.formBuilder.group(
      {
        prenom:['',Validators.required],
        nom:['',Validators.required],
        sexe:['m',Validators.required],
        adresse:['',],
        telephone:['',Validators.required],
        email:['',[Validators.required,Validators.email]],
        username:['',Validators.required],
        password:['',Validators.required],
        etat_compte:['1'],
      }
    );
  }

  onSubmitForm(){
    const formValue=this.userForm.value;
    const newUser= new Personne(
      formValue['id_personne'],
      this.compteService.generateKey(8),
      formValue['prenom'],
      formValue['nom'],
      formValue['sexe'],
      formValue['adresse'],
      formValue['telephone'],
      formValue['email'],
      formValue['username'],
      this.compteService.crypt_pwd(formValue['password']),
      formValue['etat_compte'],
    );
    this.compteService.addPersonne(newUser).subscribe(
      {
        next:(v)=>{
          this.initForm();
        },
        error:(e)=>alert('Erreur de sauvegarde '+e.message),
      }
    );
  }

}
