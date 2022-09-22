import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';


import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './shared/footer/footer.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SectionsModule } from './sections/sections.module';
import { LoginDialog } from 'src/dialogs/login/login.dialog';
import { RegisterDialog } from 'src/dialogs/registrer/register.dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { LegalsInformations } from 'src/views/legals-informations/legals-informations';
import { PrivacyPolicy } from 'src/views/privacy-policy/privacy-policy.view';
import { ContactView } from 'src/views/contact/contact.view';
import { ParticipateComponent } from 'src/components/participate/participate';
import { AddUserComponent } from 'src/components/user/add-user/add-user.component';
import { SharedModule } from '../modules/shared.module';
import { LoaderService } from '../services/loader.service';
import { LoaderInterceptor } from '../interceptors/loader-interceptor.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { DialogComponent } from './dialog/dialog.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},

];

@NgModule({
  declarations: [	
    AppComponent,
    FooterComponent,
    HomeComponent,
    NavbarComponent,
    ParticipateComponent,
    SiteLayoutComponent,
    DialogComponent,
    
    //Views
    LegalsInformations,
    PrivacyPolicy,
    ContactView,
    
    //DIALOGS
    LoginDialog,
    RegisterDialog,
    AddUserComponent,
  //Service
      SiteLayoutComponent
   ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    SectionsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
