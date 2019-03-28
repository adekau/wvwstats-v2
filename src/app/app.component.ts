/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ConnectionService } from './@core/services/connection.service';
import { Subscription } from 'rxjs';
import { NbToastrService, NbThemeService } from '@nebular/theme';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  onlineSubscription: Subscription;
  offlineSubscription: Subscription;

  constructor(
    private analytics: AnalyticsService,
    public connection: ConnectionService,
    public toast: NbToastrService,
    public theme: NbThemeService,
  ) { }

  ngOnInit(): void {
    const themeName = window.localStorage.getItem('wvwstats-theme');
    if (themeName) {
      this.theme.changeTheme(themeName);
    }

    this.analytics.trackPageViews();
    this.onlineSubscription = this.connection.online.subscribe(() => {
      this.toast.info('Internet connection restored.', 'Network');
    });
    this.offlineSubscription = this.connection.offline.subscribe(() => {
      this.toast.danger('Internet connection lost.', 'Network');
    });
  }

  ngOnDestroy(): void {
    this.onlineSubscription.unsubscribe();
    this.offlineSubscription.unsubscribe();
  }
}
