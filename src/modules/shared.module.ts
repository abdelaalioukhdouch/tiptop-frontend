import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SafeHtmlPipe } from './shared/custom-form/pipes/safe-html.pipe';
import { DotfieldPipe } from '../pipes/dotfield.pipe';
import { AdminService } from 'src/services/admin.service';

@NgModule({
      imports: [
            CommonModule,
            HttpClientModule,
            MatTooltipModule
      ],
      exports: [
            CommonModule,
            SafeHtmlPipe,
            MatTooltipModule,
            DotfieldPipe
            // DateAgoPipe
      ],
      declarations: [
            SafeHtmlPipe,
            DotfieldPipe,
            // DateAgoPipe
      ],
      providers: [AdminService],
      entryComponents: [
      ]
})
export class SharedModule { }
