import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from 'src/dialogs/login/login.dialog';
import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    userIsAuthenticated = false;
    currentUser: any;
    userRole: string;
    targetDate = new Date("Dec 31, 2024 23:59:59").getTime();
    displayTime: string;
    profile: any;
    private interval;


    profileisSet = false

    model = {
        left: true,
        middle: false,
        right: false
    };

    constructor(public dialog: MatDialog, private authService: AuthService, private profileService: ProfileService) { 
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 20); // Add 20 days to the current date
      this.targetDate = currentDate.getTime();
    }

    ngOnDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  
    startCountdown() {
      this.interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
  
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
        this.displayTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  
        if (distance < 0) {
          clearInterval(this.interval);
          this.displayTime = "EXPIRED";
        }
      }, 1000);
    }

    ngOnInit() {
      this.startCountdown();

        this.profileisSet = this.profileService.getIsProfileSet()
        this.currentUser = this.authService.getUserData();
        this.userRole = this.currentUser?.user?.role;


        console.log('test', this.userRole)

        this.userIsAuthenticated = this.authService.getIsAuth();
      if (this.userIsAuthenticated) {
         this.getProfile()
      }
    }

    getProfile() {
      this.profileService.getProfileByCreatorId().subscribe(prof => {
        this.profileisSet = true
        //this.username = prof.profile.username
        this.userRole = prof.profile.role
        this.profile = {
          id: prof.profile._id,
          username: prof.profile.username,
          bio: prof.profile.bio,
          imagePath: prof.profile.imagePath,
          creator: prof.profile.creator,
          role: prof.profile.role
        };
        //this.userIsAdmin = this.profile.role === 'admin';

      },
        err => {
          this.profileisSet = false
          //this.username = null
        })
  
    }


    logIn(): void {
      const dialogCard = this.dialog.open(LoginDialog, {
          width: '70%',
          height: '80%',
          panelClass: 'mat-dialog-any-padding',
          autoFocus: false
      });

      dialogCard.afterClosed().subscribe(rslt => {
         // if(rslt == "FORGET_PASSWORD")
           //   this.forgetPassword();
      });
  }
}
