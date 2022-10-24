
import { Component,  Input,  OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Image } from 'src/app/model/image.model';
import { Carburant } from 'src/app/model/param/carburant.model';
import { Marque } from 'src/app/model/param/marque.model';
import { Vehicule } from 'src/app/model/vehicule.model';
import { CompteService } from 'src/app/service/compte.service';
import { ParametreService } from 'src/app/service/parametre.service';
import { VehiculeService } from 'src/app/service/vehicule.service';
import { environment } from 'src/environments/environment';
//import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-add-vehicule',
  templateUrl: './add-vehicule.component.html',
  styleUrls: ['./add-vehicule.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 2500, noPause: true, showIndicators: true } }
  ]
})
export class AddVehiculeComponent implements OnInit {
  vehicule: Vehicule = {
    id_vehicule:0,
    matricule: '',
    description: '',
    created:new Date,
    modified:new Date,
    code_vehicule:'',
    type_carburant:0,
    statut:'',
    imageList:[],
    id_marque:0
   
  };
    modalRef?: BsModalRef;
    dismissible = true;
    btn_default:boolean=true;
    btn_vu:boolean=false;
    btn_edit:boolean=false;
    id_vehicules!:number;
    matricules!: string;
    descriptions!: string;
    createds!:Date;
    modifieds!:Date;
    code_vehicules!:string;
    type_carburants!:number;
    statuts!:string;
    imageLists!:Image[];
    id_marques!:0;
  /************KKkkk */
  urlimg:string='';
  base64: String='';
  image:Image={
    id_image:0,
    url:'',
    code_vehicule:'',
  };
  submitted = false;
  edit_click=false;
  pub="pub";
  vente="vente";
  location="location";
  transport="transport";
  public base_url!:string;
  marques!:Marque[];
  marque:Marque=new Marque("");
  carburants!:Carburant[];
  vehicules:Vehicule[]=[];
  images:Image[]=[];
  imgList:Image[]=[];
  filePath!: string;
  myForm!: FormGroup;
  constructor(private modalService: BsModalService,private matDialog: MatDialog,private vehiculeService: VehiculeService,private compteService:CompteService,private formBuilder:FormBuilder,
    private router :Router,private paramService:ParametreService) { }/**,private toastr: ToastrService */
    public vForm! : FormGroup;


    ngOnInit(): void {
      this.btn_default=true;
      this.btn_edit=false;
      this.btn_vu=false;
      this.base_url=environment.localUrl;
      this.getParametre("getMarques","getCarburants");
      this.initForm();
      this.getVehicule();
      /***************************table******************************** */
      
    }

    openModal(template: TemplateRef<any>) {
      this.getParametre("getMarques","getCarburants");
      this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'gray modal-lg' }));
    }

    initForm(){
      this.vForm=this.formBuilder.group(
        {
          id_vehicule:['',Validators.required],
          matricule:['',Validators.required],
          description:['',Validators.required],
          created:'',
          modified:'',
          code_vehicule:[''],
          type_carburant:['',Validators.required],
          statut:[''],
          id_marque:[0],
          img: [null],
          filename: [''],
          images:[],
          imgList:[]
        }
      );
    }
  
    /**convertImageTobase64String(){
       let inputFile:HTMLInputElement;
      inputFile=<HTMLInputElement>document.getElementById("image");
      let reader=new FileReader();
      if(inputFile!=null)
     { if(inputFile?.files!?.length>0)
      {
        reader.readAsDataURL(inputFile?.files![0]);
        reader.onloadend=()=>{
          this.base64=reader.result!?.toString();
          this.image.id_image=0;
          this.image.url=this.base64.split(",")[1];
          this.image.code_vehicule+="code_v";
          let img =new Image(this.image.url,"code_v");
          this.images.push(img);
          console.log("taille fichier "+this.images.length);
          
        }
      }
      else
      {
        console.log("empty file ");
      }
    }
    }*/
    onSubmitForm(){
      const formValue=this.vForm.value;
      var code_vehicule= this.compteService.generateKey(8);
      this.vehicule.id_vehicule=formValue['id_vehicule'];
      this.vehicule.matricule=formValue['matricule'];
      this.vehicule.description=formValue['description'];
      this.vehicule.created=new Date();
      this.vehicule.modified=new Date();
      this.vehicule.code_vehicule=code_vehicule;
      this.vehicule.type_carburant=formValue['type_carburant'];
      this.vehicule.statut=formValue['statut'];
      this.vehicule.imageList=this.images;
      this.vehicule.id_marque=formValue['id_marque'];
      console.log("vehicule save "+this.vehicule.code_vehicule+" et "+this.vehicule.created);
      this.vehiculeService.createimg(this.vehicule,"vehicule/addimg").subscribe(
        {
          next:(v)=>{
            //this.toastr.success( 'Validation Faite avec Success'); 
            this.router.navigate(['/vehicule']);
            this.getVehicule();
            this.imgList.splice(0,this.imgList.length);
            this.initForm();
            
           // alert('vehicule cree'+v)
            //this.alertService.success('Ajout avec succes',this.options);
          },
          error:(e)=>{
            alert("erreur ")
           // this.alertService.error('une erreur est survenue',this.options);
          },
        });
    }

    imagePreview(e:any) {
      const file = (e.target as HTMLInputElement).files![0];
  
      this.vForm.patchValue({
        img: file
      });
  
      const reader = new FileReader();
      reader.onload = () => {
        this.filePath = reader.result as string;
        let img =new Image(this.filePath.split(",")[1],"code_v");
        let img2 =new Image(this.filePath,"code_v");
          this.images.push(img);
          this.imgList.push(img2);
          console.log("taille : imgList=>"+this.imgList.length+" images "+this.images.length);
          console.log("url img:"+this.imgList[0].url);
          console.log("url images:"+this.images[0].url);
      }
      reader.readAsDataURL(file)
    }

    removeImage(i:number)
    {
      this.images.splice(i,1);
      this.imgList.splice(i,1);
    }

    /*
    onFileChanged(event:any) {
      const files = event.target.files;
      if (files.length === 0)
          return;
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*) == null) {
          //this.message = "Only images are supported.";
          return;
      }
      const reader = new FileReader();
      //this.imagePath = files;
      reader.readAsDataURL(files[0]); 
      reader.onload = (_event) => { 
        this.urlimg+= reader.result; 
          this.base64=this.urlimg.split(",")[1]
          alert("url "+reader.result);
      }
  }*/

  displayStyle = "none";
  displayStyle1 = "none";
  openPopup1(id:any) {
    this.vehiculeService.findById("getVehicule",id).subscribe({
      next:(v)=>{
        this.code_vehicules= v.code_vehicule;
        this.matricules=v.matricule;
        this.vehicule=v;
        this.imageLists=v.imageList;
        this.urlimg=this.imageLists[0].url;
        console.log("liste img "+v.imageList[0].url);
        console.log("liste img 2 "+this.imageLists[0].url);
      },
      error:(e)=>{
        alert("erreur de recuperation "+id);
      }
    });
    this.displayStyle1= "block";
  }

  return()
  {
    this.btn_default=true;
    this.btn_edit=false;
    this.btn_vu=false;
  }
  openModalDetail(detail: TemplateRef<any>) {
    this.modalRef = this.modalService.show(detail,Object.assign({}, { class: 'gray modal-lg' }));
  }

  getVById(id:any,detail: TemplateRef<any>) {
    this.btn_default=false;
    this.btn_edit=false;
    this.btn_vu=true;
    this.vehiculeService.findById("getVehicule",id).subscribe({
      next:(v)=>{
        this.code_vehicules= v.code_vehicule;
        this.matricules=v.matricule;
        this.vehicule=v;
        this.imageLists=v.imageList;
        this.urlimg=this.imageLists[0].url;
        this.paramService.getParametreById("getMarqueById",v.id_marque).subscribe({
          next:(p)=>{
            this.marque=p;
            console.log("libelle "+this.marque.libelle)
          },
          error(err) {
            console.log("erreur getpbyid "+err)
          },
        });
        this.modalRef = this.modalService.show(detail,Object.assign({}, { class: 'gray modal-lg' }));
        console.log("liste img "+v.imageList[0].url);
        console.log("liste img 2 "+this.imageLists[0].url);
      },
      error:(e)=>{
        alert("erreur de recuperation "+id);
      }
    });
  }
  editVehicule(id:any) {
    /*this.edit_click=true;
    this.btn_default=false;
    this.btn_edit=false;
    this.btn_vu=false;*/
    this.vehiculeService.findById("getVehicule",id).subscribe({
      next:(v)=>{
        this.vForm.controls['id_vehicule'].setValue(v.id_vehicule);
        this.vForm.controls['code_vehicule'].setValue(v.code_vehicule);
        this.vForm.controls['matricule'].setValue(v.matricule);
        this.vForm.controls['description'].setValue(v.description);
        this.vForm.controls['type_carburant'].setValue(v.type_carburant);
        this.vForm.controls['id_marque'].setValue(v.id_marque);
        this.vForm.controls['created'].setValue(v.created);
        this.vForm.controls['modified'].setValue(new Date());
        this.vForm.controls['statut'].setValue(v.statut);
        this.code_vehicules= v.code_vehicule;
        this.matricules=v.matricule;
        const reader = new FileReader();
        this.filePath = reader.result as string;
        let img =new Image(this.filePath.split(",")[1],"code_v");
        let img2 =new Image(this.filePath,"code_v");
          this.images.push(img);
          this.imgList.push(img2);

        this.vehicule=v;
        this.imageLists=v.imageList;
        this.urlimg=this.imageLists[0].url;
        console.log("liste img "+v.imageList[0].url);
        console.log("liste img 2 "+this.imageLists[0].url);
      },
      error:(e)=>{
        alert("erreur de recuperation "+id);
      }
    });
    this.displayStyle= "block";
  }
  closePopup() {
    this.displayStyle = "none";
    this.displayStyle1 = "none";
  }

  getVehicule()
  {
    this.vehiculeService.getAll("getVehicules").subscribe({
      next:(values)=> {
        if(values!=null)
        this.vehicules=values;
        console.log("images liste "+values);
        console.log("images liste 2 "+this.vehicule);
      },
      error:(err) =>{
        alert("erreur de recuperation "+err);
      },
    });
  }

  getParametre(marque:string,carburant:string)
  {
    this.paramService.getParametres(marque).subscribe({
      next:(m)=>{
        this.marques=m;
        console.log("marque list "+this.marques);

      },
      error:(e)=>alert("erreur de recuperation des parametres "+e.message),
      
    });
    this.paramService.getParametres(carburant).subscribe({
      next:(c)=>{
        this.carburants=c;
        console.log("c list "+this.carburants);

      },
      error:(e)=>alert("erreur de recuperation des parametres "+e.message),
      
    });
  }
  delev(id:any){
    this.vehiculeService.delete(id,"delete_vehicule").subscribe({
      next:(res)=>{
        this.getParametre("getMarques","getCarburants");
        this.getVehicule();
      },
      error:(e)=>{
        alert("erruer "+e.message)
      }
    });
  }
  
  get menu()
  {
    return this.vForm.get('id_marque');
  }
  get carburant()
  {
    return this.vForm.get('type_carburant');
  }
  get statut()
  {
    return this.vForm.get('statut');
  }
  onMenuSelect()
  { 
  }
  


}
