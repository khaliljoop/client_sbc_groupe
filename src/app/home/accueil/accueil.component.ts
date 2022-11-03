import { Component, OnInit, TemplateRef } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Vehicule } from 'src/app/model/vehicule.model';
import { GlobalService } from 'src/app/service/global.service';
import { VehiculeService } from 'src/app/service/vehicule.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 2500, noPause: true, showIndicators: true } }
  ]
})
export class AccueilComponent implements OnInit {
  public globalService!:GlobalService;
  public modalService!: BsModalService;
  vehicules:Vehicule[]=[];
  detail_v:Vehicule={
    id_vehicule:0,
    id_marque:0,
    code_vehicule:'',
    created:new Date,
    modified:new Date,
    imageList:[],
    statut:'',
    type_carburant:0,
    matricule:'',
    description:''
  }
  v_ventes:Vehicule[]=[];
  v_locations:Vehicule[]=[];
  v_transport:Vehicule[]=[];
  displayStyle = "none";
  constructor(private vehiculeService:VehiculeService){}
  ngOnInit(): void {
    this.getVCategorie()
  }

  
  openPopup(id:any) {
    this.vehiculeService.findById("getVehicule",id).subscribe({
      next:(v)=>{
        this.detail_v=v;
      }
    });
    this.displayStyle = "block";
  }
  closePopup() {
    this.ngOnInit();
    this.displayStyle = "none";
  }
  getVCategorie(){
    this.vehiculeService.getAll("getVehicules").subscribe({
      next:(v)=>{
        this.vehicules=v;
        //this.vehicules[0].imageList[0]
        console.log("ventes plus "+this.vehicules.length)
        for(let v of this.vehicules){
          if(v.statut=="vente"){
            this.v_ventes.push(v);
            console.log("ventes "+this.v_ventes.length)
          }
          if(v.statut=="transport"){
            this.v_transport.push(v);
            console.log("transport "+this.v_transport.length)
          }
          if(v.statut=="location"){
            this.v_locations.push(v);
            console.log("location "+this.v_locations.length)
          }
        }
      },
      error:(e)=>{},
      
    });
  }
  show_detail(){
    alert("detail clicked");
  }

}
