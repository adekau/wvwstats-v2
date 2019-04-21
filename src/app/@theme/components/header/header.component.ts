import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { NbMenuService, NbSidebarService, NbSearchService } from '@nebular/theme';
import { AnalyticsService } from '../../../@core/utils';
import { LayoutService } from '../../../@core/utils';
import { takeWhile } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() position = 'normal';

  private alive: boolean = true;
  user: any;

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private analyticsService: AnalyticsService,
    private layoutService: LayoutService,
    private searchService: NbSearchService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.searchService.onSearchSubmit()
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(this.handleSearch.bind(this));
  }

  ngAfterViewInit() {
    if (window.localStorage.getItem('sidebar-compact') === 'true') {
      this.sidebarService.toggle(true ,'menu-sidebar');
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    this.saveCompactSetting();

    return false;
  }

  saveCompactSetting() {
    const c: boolean = window.localStorage.getItem('sidebar-compact') === 'true';
    window.localStorage.setItem('sidebar-compact', (!c).toString());
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  handleSearch(searchObj: { term: string, tag?: string }) {
    this.router.navigate(['/search', searchObj.term]);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
