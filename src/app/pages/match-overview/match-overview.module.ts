import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchOverviewComponent } from './match-overview.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [MatchOverviewComponent],
  imports: [
    ThemeModule,
    CommonModule,
    NgxEchartsModule,
  ],
})
export class MatchOverviewModule { }
