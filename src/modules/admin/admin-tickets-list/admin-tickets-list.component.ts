import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Appsettings } from 'src/app/app.settings';
import { DashboardService } from '../../../services/dashboard.service';
import { CustomFormComponent } from '../../shared/custom-form/custom-form.component';
import { CustomFormModel } from '../../shared/custom-form/custom-form.model';
import { AdminService } from '../services/admin.service';
import { FormControl } from '@angular/forms';
import { ProfileService } from 'src/services/profile.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-admin-tickets-list',
  templateUrl: './admin-tickets-list.component.html',
  styleUrls: ['./admin-tickets-list.component.scss', '../admin-font/admin-font.component.scss']
})
export class AdminTicketsListComponent implements OnInit {

  userIsAuthenticated = false;
  userRole: string;
  private authListenerSubs: Subscription;
  profile: any;
  username: string
  profileisSet = false
  userIsAdmin = false;
  currentUser : any;

  apiData: any;

  noMoreRecords = false;

  searchCtrl = new FormControl();

  $destroy = new Subject();

  allTickets: any[] = [];
filteredTickets: any[] = [];


  constructor(
    public adminSvc: AdminService,
    private dialog: MatDialog,
    private dashboardSvc: DashboardService,
    private authService: AuthService, private profileService: ProfileService

  ) {
    this.getRecords();

    this.searchCtrl.valueChanges.pipe(debounceTime(1000)).pipe(distinctUntilChanged())
    .subscribe(res => {
      this.apiData = {};
      this.getRecords();
    })
  }

  ngOnInit() {
    this.currentUser = this.authService.getUserData();
    //this.userRole = this.authService.getUserRole();

    this.profileisSet = this.profileService.getIsProfileSet()
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.getProfile()
    }

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        if (this.userIsAuthenticated) {
          this.getProfile()
        }
      });
   this.userRole = this.currentUser?.user?.role;
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  getRecords(): void {
    let query = `q=${(this.searchCtrl.value || '')}`;
    
    if (!this.apiData) this.apiData = {};
    if (!this.apiData.page) this.apiData.page = 0;
    let page = (++this.apiData.page);
    query += `&page=${page}`;
    this.adminSvc.getTickets(query)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res: any) => {
        if (res && res.data.length) {
          if (!this.apiData) this.apiData = <any>{};
          if (!this.apiData.data) this.apiData.data = [];
          this.apiData.data = this.apiData.data.concat(res.data);
          this.apiData.page = res.page;
          this.noMoreRecords = false;
          this.allTickets = res.data;
      this.filteredTickets = res.data;
        } else {
          this.noMoreRecords = true;
        }
      })
  }

  filterTickets(): void {
    const searchTerm = this.searchCtrl.value || '';
    if (!searchTerm) {
      this.filteredTickets = this.allTickets;
    } else {
      this.filteredTickets = this.allTickets.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }
  

  addFont(record?: any, index?: number): void {

    let dialog = this.dialog.open(CustomFormComponent, {
      minWidth: '40%'
    });
    dialog.componentInstance.model = <CustomFormModel[]>[
        { name: 'code', placeholder: 'Code', type: 'text', required: true },
        { name: 'title', placeholder: 'Title', type: 'text', required: true },
        { name: 'isClaimed', placeholder: 'Claimed', type: 'checkbox' },
        { name: 'isActive', placeholder: 'Active', type: 'checkbox' },
    ];
    if (record) {
      //edit case
      record.editing = true;
      dialog.componentInstance.valueModel = cloneDeep(record);
      dialog.componentInstance.title = `Edit Ticket`;
      dialog.componentInstance.updateMode = true;
      dialog.componentInstance.submitUrl = `${Appsettings.API_ENDPOINT}/ticket/${record['_id']}`;
    } else {
      dialog.componentInstance.submitUrl = `${Appsettings.API_ENDPOINT}/ticket`;
      dialog.componentInstance.title = `Add New Ticket`;
    }
    dialog.afterClosed().subscribe(res => {
      if (res && res.result) {
        if (!this.apiData) this.apiData = {};
        if (!this.apiData.data) this.apiData.data = [];
        res.result.animated = true;
        if (record) {
          this.apiData.data[<number>(index)] = res.result;
        } else {
          this.apiData.data.push(res.result);
        }

        setTimeout(() => {
          delete res.result.animated;
        }, 5000);
      }
      try { delete record.editing; } catch (err) { }
    })
  }

  deleteFont(index: number): void {
    try { this.apiData.data[index].editing = true; } catch (err) { }
    this.dashboardSvc.showConfirmDialog(`Are you sure you want to delete this record?`, `Once you click yes, you wont be able to recover the deleted item`, (res: boolean) => {
      if (res) {
        this.adminSvc.deleteTicket(this.apiData.data[index]['_id']).pipe(takeUntil(this.$destroy))
          .subscribe((res: any) => {
            this.dashboardSvc.showInfoDialog(`The record has been deleted successfully`, ``, 'success', () => {
              this.apiData.data.splice(index, 1);
            });
          })
      }
      try { delete this.apiData.data[index].editing; } catch (err) { }
    })
  }

  getProfile() {
    this.profileService.getProfileByCreatorId().subscribe(prof => {
      this.profileisSet = true
      this.username = prof.profile.username
      this.userRole = prof.profile.role
      this.profile = {
        id: prof.profile._id,
        username: prof.profile.username,
        bio: prof.profile.bio,
        imagePath: prof.profile.imagePath,
        creator: prof.profile.creator,
        role: prof.profile.role
      };
      this.userIsAdmin = this.profile.role === 'admin';

    },
      err => {
        this.profileisSet = false
        this.username = null
      })

  }

}
