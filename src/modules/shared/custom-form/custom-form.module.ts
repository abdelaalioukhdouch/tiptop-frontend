import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFormComponent } from './custom-form.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AutoChipsComponent } from './auto-chips/auto-chips.component';
import { SharedModule } from '../../shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ScrollingModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
  exports: [CustomFormComponent],
  entryComponents: [CustomFormComponent],
  declarations: [CustomFormComponent, AutoChipsComponent
  ]
})
export class CustomFormModule { }
