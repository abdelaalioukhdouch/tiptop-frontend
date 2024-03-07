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
import { AuthService } from 'src/services/auth.service';

interface Gain {
  id: string; // Include the id property
  user: string;
  ticket: string;
  claimedAt: Date;
  userName: string; // Add userName field
  ticketTitle: string; // Add ticketTitle field
  // Add other properties as needed
}


@Component({
  selector: 'app-admin-gains',
  templateUrl: './admin-gains.component.html',
  styleUrls: ['./admin-gains.component.scss', '../admin-font/admin-font.component.scss']
})

export class AdminGainsComponent implements OnInit {
  gains: Gain[] = [];
  totalGains: number = 0;
  userRole: string;
  currentUser : any;



  constructor(private adminService: AdminService, public authService: AuthService) { }

  ngOnInit() {
    this.loadGains();

    this.currentUser = this.authService.getUserData();

    this.userRole = this.currentUser?.user?.role;

  }

  loadGains(): void {
    this.adminService.getGains().subscribe(
      (data: Gain[]) => {
        this.gains = data;
        this.totalGains = this.gains.length; // Calculate the total number of gains
      console.log(this.gains);
        console.log(this.gains)
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
  
  deleteGain(gainId: string): void {
    this.adminService.deleteGain(gainId).subscribe(
      () => {
        // Successfully deleted, update the gains list
        this.gains = this.gains.filter((gain) => gain.id !== gainId);
        this.totalGains = this.gains.length;
      },
      (error) => {
        console.error('Error deleting gain:', error);
      }
    );
  }


}
