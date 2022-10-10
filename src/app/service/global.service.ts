import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  modalRef?: BsModalRef;
  dismissible = true;
  constructor(private modalService: BsModalService) {
    
  }
 
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
