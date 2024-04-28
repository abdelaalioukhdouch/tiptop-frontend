import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LoginDialog } from 'src/dialogs/login/login.dialog';
import { User } from 'src/models/User';
import { AuthService } from 'src/services/auth.service';
import { ProfileService } from 'src/services/profile.service';
import { UserDataService } from './userData.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  user: User;

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

    title = 'cookie-demo';

    constructor(
      private userDataService: UserDataService,
      private cookieService: CookieService,public dialog: MatDialog, private authService: AuthService, private profileService: ProfileService) { 
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 20); // Add 20 days to the current date
      this.targetDate = currentDate.getTime();
    }

    getUserData() {
      this.user = this.userDataService.retrieveUserDataFromCookie();
    }
  
    clearUserData() {
      this.userDataService.clearUserDataCookie();
    }
    setCookie() {
      this.cookieService.set('TestCookie', 'Hello World', 4, '/');
      console.log('Cookie set');
    }
  
    getCookie() {
      const cookieValue = this.cookieService.get('TestCookie');
      console.log('Cookie value:', cookieValue);
    }
  
    deleteCookie() {
      this.cookieService.delete('TestCookie');
      console.log('Cookie deleted');
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
      this.user = this.authService.getUserData();
    if (this.user) {
      this.userDataService.storeUserDataInCookie(this.user);
    }
      this.user = this.authService.getUserData();
      this.startCountdown();

        this.profileisSet = this.profileService.getIsProfileSet()
        this.currentUser = this.authService.getUserData();
        this.userRole = this.currentUser?.user?.role;


        console.log('test', this.userRole)

        this.userIsAuthenticated = this.authService.getIsAuth();
      if (this.userIsAuthenticated) {
         this.getProfile()
      }
    this.currentUser = this.authService.getUserData(); // Assuming this returns user data
    if (this.currentUser) {
      this.userRole = this.currentUser.role;
      this.setEmailInCookie(this.userRole);
    }
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.getProfile();
    }
    this.startCountdown();
  }

  setEmailInCookie(email: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Cookie will expire in 7 days
    this.cookieService.set('userEmail', email, expires, '/');
  }


  getEmailFromCookie(): string {
    return this.cookieService.get('userEmail');
  }
  

  deleteEmailCookie() {
    this.cookieService.delete('userEmail', '/');
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
