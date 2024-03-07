import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

  @ViewChild('searchFormControl', { static: false }) searchFormControl: ElementRef;
  private _config: SideNavConfig;
  @Input() set config(config: SideNavConfig) {
    this._config = config;
    if (config && config.sideNavButtons && config.sideNavButtons.length > 0) {
      // Ensure the config is initialized properly before attempting to use it
      this.sideNavButtonClicked(null, this.config.sideNavButtons[1]);
    }
  }

  get config(): SideNavConfig {
    return this._config;
  }

  selectedSideNav: SideNavButton | null;
  showSubNav = false;
  sideNavTitle = 'Search Template';
  selectedNavItem: string;
  $destroy = new Subject<void>();

  searchControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.searchControl.valueChanges.pipe(
      distinctUntilChanged(), 
      debounceTime(600),
      takeUntil(this.$destroy)
    ).subscribe((res: string) => {
      this.search(res);
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.$destroy)
    ).subscribe(() => {
      this.route.firstChild?.data.subscribe(data => {
        this.selectedNavItem = data['selectedNavItem'];
      }).unsubscribe(); // Here we unsubscribe immediately because data will emit once per navigation event
    });
  }

  ngOnInit() {
    // Moved inside the setter of config to ensure it's only called when config is properly initialized
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  search(keyword: string): void {
    // Implement your search logic here
  }

  sideNavButtonClicked(event: Event | null, sideNavButton: SideNavButton, bypassToggleLogic?: boolean) {
    if (sideNavButton?.type === 'routerLink') {
      this.router.navigate([sideNavButton.link]);
    }
    // Implement logic for 'subNav' type and handling of 'bypassToggleLogic' if required
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
