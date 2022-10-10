import { Component, OnInit, TemplateRef } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { BsModalService } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/service/global.service';

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
  public modalService!: BsModalService
  ngOnInit(): void {
  }

}
