import { NgModule } from '@angular/core';

import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { MatchupCardComponent } from './matchup-card/matchup-card.component';
import { MatchupCardRowComponent } from './matchup-card/matchup-card-row/matchup-card-row.component';
import { MatchupHeaderCardComponent } from './matchup-header-card/matchup-header-card.component';


@NgModule({
  imports: [
    ThemeModule,
    NgxEchartsModule,
  ],
  declarations: [
    DashboardComponent,
    MatchupCardComponent,
    MatchupCardRowComponent,
    MatchupHeaderCardComponent,
  ],
})
export class DashboardModule { }
