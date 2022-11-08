import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MatDialogModule,MatDialogRef, } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
//import { ToastrService } from 'ngx-toastr';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover'; 
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule  } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule} from  '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccueilComponent } from './home/accueil/accueil.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DatePipe } from '@angular/common';
import { ParametreComponent } from './parametre/parametre.component';
import { AddVehiculeComponent } from './vehicule/add-vehicule/add-vehicule.component';
import { ProfilComponent } from './sys/profil/profil.component'; 
import { AddMenuComponent } from './sys/menu/add-menu/add-menu.component'; 
import { AddSmenuComponent } from './sys/smenu/add-smenu/add-smenu.component';
import { LoginComponent } from './Auth/login/login.component'; 
import { MatMenuModule } from '@angular/material/menu';
import { CreateCountComponent } from './Auth/create-count/create-count.component';
import { UserComponent } from './sys/user/user.component'; 

@NgModule({
  declarations: [
    AppComponent,
    AccueilComponent,
    SidebarComponent,
    //ParametreComponent,
    ParametreComponent,
    AddVehiculeComponent,
    ProfilComponent,
    AddMenuComponent,
    AddSmenuComponent,
    LoginComponent,
    CreateCountComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    MatToolbarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatFormFieldModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),

  ],
  providers: [DatePipe,{ provide: MAT_DIALOG_DATA, useValue: {} ,},
    PaginationConfig,
    { provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
