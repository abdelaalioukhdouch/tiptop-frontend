import { ProfileService } from 'src/services/profile.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from 'src/dialogs/login/login.dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';


@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  currentUser: any;

  isMenuCollapsed = true;

    public isCollapsed = true;
    userIsAuthenticated = false;
    userRole: string;
    private authListenerSubs: Subscription;
    profile: any;
    username: string
    profileisSet = false
    userIsAdmin = false;
    //private lastPoppedUrl: string;
    private yScrollStack: number[] = [];

    constructor(private cdRef: ChangeDetectorRef, private authService: AuthService, private profileService: ProfileService,public dialog: MatDialog,public location: Location, private router: Router) {
    }

    getPath(){
      return this.router.url;
    }
    scroll(el: HTMLElement) {
      el.scrollIntoView();
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


        console.log('test', this.userRole)
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

    onLogout() {
      this.authService.logout();
      this.cdRef.detectChanges();

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


    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if( titlee === '#/home' ) {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if( titlee === '#/documentation' ) {
            return true;
        }
        else {
            return false;
        }
    }
}
