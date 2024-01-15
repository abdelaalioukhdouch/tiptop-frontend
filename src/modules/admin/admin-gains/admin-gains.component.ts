import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Appsettings } from 'src/app/app.settings';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomFormComponent } from '../../shared/custom-form/custom-form.component';
import { CustomFormModel } from '../../shared/custom-form/custom-form.model';
import { AdminService } from '../services/admin.service';
import { FormControl } from '@angular/forms';

interface Gain {
  user: string;
  ticket: string;
  claimedAt: Date;
  // Add other properties as needed
}

@Component({
  selector: 'app-admin-gains',
  templateUrl: './admin-gains.component.html',
  styleUrls: ['./admin-gains.component.scss', '../admin-font/admin-font.component.scss']
})

export class AdminGainsComponent implements OnInit {
  gains: Gain[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadGains();
  }

  loadGains(): void {
    this.adminService.getGains().subscribe(
      (data: Gain[]) => {
        this.gains = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  

}
