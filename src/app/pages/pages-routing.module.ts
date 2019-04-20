import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { MatchOverviewComponent } from './match-overview/match-overview.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [{
    path: 'na',
    component: DashboardComponent,
  }, {
    path: 'eu',
    component: DashboardComponent,
  }, {
    path: 'match/:region/:tier',
    component: MatchOverviewComponent,
  }, {
    path: 'search/:term',
    component: SearchResultsComponent,
  }, {
    path: '',
    redirectTo: 'na',
    pathMatch: 'full',
  }, {
    path: '**',
    component: NotFoundComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
