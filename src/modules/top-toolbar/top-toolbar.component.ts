import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CacheHandler } from '../../utils/cache-handler';
import { LoaderService } from './../../services/loader.service';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-top-toolbar',
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent implements OnInit {

  loggedInUser: any | null;

  saved = true;
  loading = false;

  constructor(
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private router: Router,
    private authSvc: AuthService,
    private location: Location
  ) {

    this.loaderService.isLoading.subscribe((v) => {
      // console.log(v);
      this.loading = v;
    });

    this.authSvc.isUserLoggedIn$.subscribe(res => {
      if (res) {
        this.loggedInUser = CacheHandler.getStoredUser();
      } else {
        this.loggedInUser = null;
      }
    })

    this.loggedInUser = <any>CacheHandler.getStoredUser();
  }

  ngOnInit() {
    // this.openBottomSheetExport('main');
    // this.onClickLogin();
    // this.openBottonSheetMobileToolbar();
  }

  goBack() {
    //this.location.back(); // Utilise la fonction back() de Location pour revenir en arrière
    this.router.navigate(['/home']);
  }

  home(){
      this.router.navigate(['/admin']);
  }

  logout() {
    this.authSvc.logout();
  }

}