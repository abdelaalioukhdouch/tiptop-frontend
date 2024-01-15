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
    profileisSet = false

    model = {
        left: true,
        middle: false,
        right: false
    };

    constructor(private authService: AuthService, private profileService: ProfileService) { }

    ngOnInit() {
        this.profileisSet = this.profileService.getIsProfileSet()

        this.userIsAuthenticated = this.authService.getIsAuth();
      if (this.userIsAuthenticated) {
        // this.getProfile()
      }
    }
}
