import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SectionsComponent } from './sections.component';
import { ButtonsSectionComponent } from './buttons-section/buttons-section.component';
import { InputsSectionComponent } from './inputs-section/inputs-section.component';
import { NavigationSectionComponent } from './navigation-section/navigation-section.component';
import { TabsSectionComponent } from './tabs-section/tabs-section.component';
import { AlertsSectionComponent } from './alerts-section/alerts-section.component';
import { TypographySectionComponent } from './typography-section/typography-section.component';
import { VersionsSectionComponent } from './versions-section/versions-section.component';

@NgModule({
  declarations: [
    SectionsComponent,
    ButtonsSectionComponent,
    InputsSectionComponent,
    NavigationSectionComponent,
    TabsSectionComponent,
    AlertsSectionComponent,
    TypographySectionComponent,
    VersionsSectionComponent
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule
    ],
  exports:[ SectionsComponent ]
})
export class SectionsModule { }
