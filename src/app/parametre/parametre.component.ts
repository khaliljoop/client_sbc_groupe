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
    m_marque:Marque={
      id_marque:0,
      libelle:''
    };
    m_carburant:Carburant={
      id_carburant:0,
      libelle:''
    };

  ngOnInit(): void {
    
    this.getMParametre("getMarques");
    this.getCParametre("getCarburants");
    this.initForm();
  }

  initForm(){
    this.paramForm=this.formBuilder.group(
      {
        id_marque:[0],
        id_carburant:[0],
        type:['',Validators.required],
        libelle:['',Validators.required],
      }
    );
  }

  onSubmitForm(){
    const formValue=this.paramForm.value;
    this.m_carburant.id_carburant=formValue['id_carburant']
    this.m_carburant.libelle=formValue['libelle']
    this.m_marque.id_marque=formValue['id_marque']
    this.m_marque.libelle=formValue['libelle']
    /*const marque= new Marque(
      formValue['libelle']
    );
    const carburant= new Carburant(
      formValue['libelle']
    );*/
    //alert('Type select =  '+formValue['type']+' libelle = '+formValue['libelle'])
    if(formValue['type']=='carburant')
    {
      
      
        this.paramService.addParametre(this.m_carburant,"carburant/add").subscribe(
        {
          next:(v)=>{
            this.ngOnInit();
            this.router.navigate(["/param"]);
            console.log("carburant list "+this.carburants);
          },
          error:(e)=>alert('Erreur de sauvegarde '+e),
        }
      );
    }
    else
    {
      
      this.paramService.addParametre(this.m_marque,"marque/add").subscribe(
        {
          next:(v)=>{
            this.ngOnInit();
            this.router.navigate(["/param"]);
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
    this.initForm();
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

  delete_marque(id:any){
    this.paramService.deleteParam(id,"delete_marque").subscribe({
      next:(v)=>{
        this.getMParametre("getMarques");
        this.router.navigate(['/param']);
      },
      error:(e)=>{}
    });
  }

  edit_marque(id:any){
    this.paramService.getParametreById("getMarqueById",id).subscribe({
      next:(m)=>{
        this.paramForm.controls['type'].setValue('marque');
        this.paramForm.controls['id_marque'].setValue(m.id_marque);
        this.paramForm.controls['libelle'].setValue(m.libelle);
        this.displayStyle = "block";
      },
      error:(e)=>{}
      
    });
  }

  delete_carburant(id:any){
    this.paramService.deleteParam(id,"delete_carburant").subscribe({
      next:(v)=>{
        this.getCParametre("getCarburants");
        this.router.navigate(['/param']);
      },
      error:(e)=>{

      }
    });
  }

  edit_carburant(id:any){
    this.paramService.getParametreById("getCarburantById",id).subscribe({
      next:(c)=>{
        this.paramForm.controls['type'].setValue('carburant');
        this.paramForm.controls['id_carburant'].setValue(c.id_carburant);
        this.paramForm.controls['libelle'].setValue(c.libelle);
        this.displayStyle = "block";
      },
      error:(e)=>{}
    });
  }

  


}
