import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Carburant } from '../model/param/carburant.model';
import { Marque } from '../model/param/marque.model';
import { ParametreService } from '../service/parametre.service';
import { SecuriteService } from '../service/securite.service';

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})
export class ParametreComponent implements OnInit {

  constructor(
    private formBuilder:FormBuilder,
    private paramService: ParametreService,private securiteService:SecuriteService,
    private router :Router) { }
    carburants!:Carburant[];
    marques!:Marque[];
    paramForm! : FormGroup;
    libelle="";
    type="";
    marque="marque";
    carburant="carburant";

  ngOnInit(): void {
    
    this.getMParametre("getMarques");
    this.getCParametre("getCarburants");
    this.initForm();
  }

  initForm(){
    this.paramForm=this.formBuilder.group(
      {
        type:['',Validators.required],
        libelle:['',Validators.required],
      }
    );
  }

  onSubmitForm(){
    const formValue=this.paramForm.value;
    const marque= new Marque(
      formValue['libelle']
    );
    const carburant= new Carburant(
      formValue['libelle']
    );
    //alert('Type select =  '+formValue['type']+' libelle = '+formValue['libelle'])
    if(formValue['type']=='carburant')
    {
      
      
        this.paramService.addParametre(carburant,"carburant/add").subscribe(
        {
          next:(v)=>{
            this.initForm();
            this.getCParametre("getCarburants");
            console.log("carburant list "+this.carburants);
          },
          error:(e)=>alert('Erreur de sauvegarde '+e.message),
        }
      );
    }
    else
    {
      
      this.paramService.addParametre(marque,"marque/add").subscribe(
        {
          next:(v)=>{
            this.initForm();
            this.getMParametre("getMarques");
            console.log("marque list "+this.marques);
          },
          error:(e)=>alert('Erreur de sauvegarde '+e.message),
        }
      );
    }
  }

  navigate(){
    this.router.navigate(["/menu"]);
  }

  getMParametre(chemin:string)
  {
    this.paramService.getParametres(chemin).subscribe({
      next:(p)=>{
        this.marques=p;
        console.log("marque list "+this.marques);

      },
      error:(e)=>alert("erreur de recuperation des parametres "+e.message),
      
    });
  }
  getCParametre(chemin:string)
  {
    this.paramService.getParametres(chemin).subscribe({
      next:(p)=>{
        this.carburants=p;
        console.log("carburant list "+p);
      },
      error:(e)=>alert("erreur de recuperation des parametres "+e.message),
      
    });
  }

  displayStyle = "none";
  
  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  get menu()
  {
    return this.paramForm.get('type');
  }
  onMenuSelect()
  { 
  }


}
