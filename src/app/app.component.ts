/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ConnectionService } from './@core/services/connection.service';
import { Subscription } from 'rxjs';
import { NbToastrService, NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {

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
      this.toast.info('Internet connection restored.', 'Network Status');
    });
    this.offlineSubscription = this.connection.offline.subscribe(() => {
      this.toast.danger('Internet connection lost.', 'Network Status');
    });
  }

  ngOnDestroy(): void {
    this.onlineSubscription.unsubscribe();
    this.offlineSubscription.unsubscribe();
  }
}
