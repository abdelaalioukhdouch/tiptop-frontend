import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

  @ViewChild('searchFormControl', { static: false }) searchFormControl: ElementRef;
  _config: SideNavConfig;
  @Input() set config(config: SideNavConfig) {
    this._config = config;
    if (config) {
    }
  }

  get config(): SideNavConfig {
    return this._config;
  }

  selectedSideNav: SideNavButton | null;
  showSubNav = false;
  sideNavTitle = 'Search Template';
  selectedNavItem: string;
  $destroy = new Subject();

  searchControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.searchControl.valueChanges.pipe(distinctUntilChanged(), debounceTime(600))
      .subscribe((res: string) => {
        this.search(res);
      })


    try {
      this.router.events.subscribe(res => {
        if(res instanceof NavigationEnd) {
          this.route.children[0].data.subscribe(res => {
            this.selectedNavItem = res['selectedNavItem'];
          })
        }
      })

    } catch (err) { }
  }

  ngOnInit() {
    this.sideNavButtonClicked(null, this.config.sideNavButtons[1]);
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
  }

  search(keyword: string): void {
  }

  subscriber: any;
  sideNavButtonClicked(event: Event | null, sideNavButton: SideNavButton, bypassToggleLogic?: boolean) {
    if (sideNavButton?.type == 'routerLink') {
      this.router.navigate([sideNavButton.link]);
      // return;
    }
  }





}

export class SideNavButton {
  _id: string;
  title: string;
  svg: string;
  type?: 'subNav' | 'routerLink' = 'subNav';
  link?: string;
}

export class SideNavConfig {
  sideNavButtons: SideNavButton[];
}