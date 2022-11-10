
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
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-add-vehicule',
  templateUrl: './add-vehicule.component.html',
  styleUrls: ['./add-vehicule.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 2500, noPause: true, showIndicators: true } }
  ]
})
export class AddVehiculeComponent implements OnInit {
  
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
    search=''
    
    startItem=0
    endItem=6
    pageReturn?:Vehicule[];
    filterVehicules:Vehicule[]=[];
    totalItems = this.filterVehicules.length;
    currentPage = 1;
    smallnumPages = 0;
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
  marques:Marque[]=[{id_marque:0,libelle:''}];
  marque:Marque={
    id_marque:0,
    libelle:''
  };//=new Marque("");
  type_carburant:Carburant={
    id_carburant:0,
    libelle:''
  };
  carburants:Carburant[]=[{id_carburant:0,libelle:''}];
  vehicules:Vehicule[]=[];
  images:Image[]=[];
  imgList:Image[]=[];
  filePath!: string;
  myForm!: FormGroup;
  
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
      console.log("tail filter "+this.filterVehicules.length+" debut: "+this.startItem+" fin: "+this.endItem)
      /***************************table******************************** */
      
    }

    pageChanged(event: PageChangedEvent): void {
      this.startItem = (event.page - 1) * event.itemsPerPage;
      this.endItem = event.page * event.itemsPerPage;
      this.filterVehicules = this.vehicules.slice(this.startItem, this.endItem);
    }

    openModal(template: TemplateRef<any>) {
      this.imgList=[];
      this.images=[];
      
      this.getParametre("getMarques","getCarburants");
      console.log("carburant "+this.vehicule.type_carburant)
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
          type_carburant:[0,Validators.required],
          statut:[''],
          id_marque:[0],
          img: [null],
          filename: [''],
          images:[],
          imgList:[]
        }
      );
    }

    onSubmitForm(){
      const formValue=this.vForm.value;
      var code_vehicule= this.compteService.generateKey(8);
      this.vehicule.id_vehicule=formValue['id_vehicule'];
      this.vehicule.matricule=formValue['matricule'];
      this.vehicule.description=formValue['description'];
      this.vehicule.created=new Date();
      this.vehicule.modified=new Date();
      this.vehicule.code_vehicule=code_vehicule;
      this.vehicule.type_carburant=formValue['type_carburant']!=0?formValue['type_carburant']:this.vehicule.type_carburant;
      this.vehicule.id_marque=formValue['id_marque']!=0?formValue['id_marque']:this.vehicule.id_marque;
      this.vehicule.statut=formValue['statut'];
      this.vehicule.imageList=this.images;
      
      console.log("vehicule carburant "+this.vehicule.type_carburant+" et "+this.vehicule.created);
      this.vehiculeService.createimg(this.vehicule,"vehicule/addimg").subscribe(
        {
          next:(v)=>{
            //this.toastr.success( 'Validation Faite avec Success'); 
            
            this.getVehicule();
            this.imgList.splice(0,this.imgList.length);
            this.initForm();
            this.imgList=[];
            this.images=[];
            this.router.navigate(['/vehicule']);
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
      console.log("file "+file)
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
        this.paramService.getParametreById("getCarburantById",v.type_carburant).subscribe({
          next:(c)=>{
            this.type_carburant=c;
            console.log("libelle "+this.type_carburant.libelle)
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
    this.imgList=[];
    this.images=[];
    this.displayStyle = "none";
    this.displayStyle1 = "none";
  }

  getVehicule()
  {
    this.vehiculeService.getAll("getVehicules").subscribe({
      next:(values)=> {
        if(values!=null)
        this.vehicules=values;
        //this.filterVehicules=values
        this.filterVehicules = this.vehicules.slice(this.startItem, this.endItem);
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
        this.vehicule.id_marque=this.marques[0].id_marque;
      },
      error:(e)=>alert("erreur de recuperation des parametres "+e.message),
      
    });
    this.paramService.getParametres(carburant).subscribe({
      next:(c)=>{
        this.carburants=c;
        this.vehicule.type_carburant=this.carburants[0].id_carburant;
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

  filter(){
    if(this.search==''){
      this.filterVehicules=this.vehicules;
    }
    else{
      var _search=this.search.toLowerCase().split('é').join('e').split('è').join('e')
      this.filterVehicules=[]
      for(let v of this.vehicules){
        var matricule=v.matricule.toLowerCase().split('é').join('e').split('è').join('e')
        var code_v =v.code_vehicule.toLowerCase().split('é').join('e').split('è').join('e')
        var statut =v.statut.toLowerCase().split('é').join('e').split('è').join('e')
        if(matricule.includes(_search) || code_v.includes(_search) || statut.includes(_search))
        this.filterVehicules.push(v)
      }
    }
  }
  


}
