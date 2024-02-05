import { Component, OnInit } from '@angular/core';
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
    private interval;


    profileisSet = false

    model = {
        left: true,
        middle: false,
        right: false
    };

    constructor(private authService: AuthService, private profileService: ProfileService) { 
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
        // this.getProfile()
      }
    }
}
