import { Component, OnInit } from '@angular/core';
import { Personne } from 'src/app/model/personne.model';
import { CompteService } from 'src/app/service/compte.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private compteService:CompteService) { }
  users:Personne[]=[];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.compteService.getPersonnes().subscribe({
      next:(users)=>{
        this.users=users;
      }
    });
  }

  editeUser(id:any){
    
  }

  deleUser(id:any){

  }


}
