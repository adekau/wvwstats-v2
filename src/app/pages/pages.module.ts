import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from '../pages/miscellaneous/miscellaneous.module';
import { MatchOverviewModule } from '../pages/match-overview/match-overview.module';
import { SearchResultsModule } from './search-results/search-results.module';
import { GraphsModule } from './graphs/graphs.module';
import { MapModule } from './map/map.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MatchOverviewModule,
    SearchResultsModule,
    GraphsModule,
    MapModule,
    MiscellaneousModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
