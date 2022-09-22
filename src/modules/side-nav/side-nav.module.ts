import { MatGridListModule } from '@angular/material/grid-list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from './side-nav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatMenuModule
  ],
  declarations: [SideNavComponent],
  exports: [
    SideNavComponent
  ]
})
export class SideNavModule { }
