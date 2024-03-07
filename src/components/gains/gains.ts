import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/modules/admin/services/admin.service';
import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';

interface Gain {
  id: string; // Include the id property
  userId: number;
  ticket: string;
  user: string;
  claimedAt: Date;
  userName: string; // Add userName field
  ticketTitle: string; // Add ticketTitle field
  email: string;
  toValidate: boolean;
}


@Component({
  selector: 'gains',
  templateUrl: './gains.html',
  styleUrls: ['./gains.scss']
})

export class GainsComponent implements OnInit {
  gains: Gain[] = [];
  totalGains: number = 0;

  currentUser: any;
  userIsAuthenticated = false;
  userRole: string;
  profile: any;
  username: string
  profileisSet = false
  userIsAdmin = false;
  rdm: number = 0;
  userEmail: string;




  constructor(private adminService: AdminService, private authService: AuthService, private profileService: ProfileService,public dialog: MatDialog) { 
  this.genererNombreAleatoire()
  }

  ngOnInit() {
    this.loadGains();
    this.currentUser = this.authService.getUserData();
      //this.userRole = this.authService.getUserRole();

      this.profileisSet = this.profileService.getIsProfileSet()
      this.userIsAuthenticated = this.authService.getIsAuth();
      if (this.userIsAuthenticated) {
        this.getProfile()
      }
      this.userEmail = this.currentUser?.user?.email;

  }

  genererNombreAleatoire() {
    this.rdm = Math.floor(Math.random() * 10) + 1;
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
  isEqual(email1: string, email2: string): boolean {
    return email1 === email2;
  }
  getProfile() {
    this.profileService.getProfileByCreatorId().subscribe(prof => {
      this.profileisSet = true
      this.username = prof.profile.username
      this.userRole = prof.profile.role
      this.userEmail = prof.profile.email

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
