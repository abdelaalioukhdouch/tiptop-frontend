import { gainsRouteData } from './../routedata.params';
import { CustomFormModule } from './../../shared/custom-form/custom-form.module';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminHomeComponent } from './admin-home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { AdminFontComponent } from '../admin-font/admin-font.component';
import { usersRouteData, ticketsRouteData } from '../routedata.params';
import { TopToolbarModule } from '../../top-toolbar/top-toolbar.module';
import { SideNavModule } from '../../side-nav/side-nav.module';
import { AdminTicketsListComponent } from '../admin-tickets-list/admin-tickets-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminGainsComponent } from '../admin-gains/admin-gains.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    // canActivate: [CanActivateViaAuthGuard],
    children: [
      {
        path: 'users',
        component: AdminFontComponent,
        data: usersRouteData
      },
      {
        path: 'tickets',
        component: AdminTicketsListComponent,
        data: {
          selectedNavItem: 'Tickets',
          data: ticketsRouteData
        }
      },
      {
        path: 'gains',
        component: AdminGainsComponent,
        data: {
          selectedNavItem: 'Gains',
          data: gainsRouteData
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TopToolbarModule,
    SideNavModule,
    MatTabsModule,
    CustomFormModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [AdminHomeComponent, AdminFontComponent, AdminTicketsListComponent, AdminGainsComponent]
})
export class AdminHomeModule { }
