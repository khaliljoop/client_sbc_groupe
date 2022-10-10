import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCountComponent } from './Auth/create-count/create-count.component';
import { LoginComponent } from './Auth/login/login.component';
import { AccueilComponent } from './home/accueil/accueil.component';
import { ParametreComponent } from './parametre/parametre.component';
import { AddMenuComponent } from './sys/menu/add-menu/add-menu.component';
import { ProfilComponent } from './sys/profil/profil.component';
import { AddSmenuComponent } from './sys/smenu/add-smenu/add-smenu.component';
import { UserComponent } from './sys/user/user.component';
import { AddVehiculeComponent } from './vehicule/add-vehicule/add-vehicule.component';

const routes: Routes = [
  {path: '', component:AccueilComponent},
  {path:'param',component:ParametreComponent},
  {path:'vehicule',component:AddVehiculeComponent},
  {path:'menu',component:AddMenuComponent},
  {path:'smenu',component:AddSmenuComponent},
  {path:'profil',component:ProfilComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:CreateCountComponent},
  {path:'users',component:UserComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
