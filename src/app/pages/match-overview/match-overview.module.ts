import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchOverviewComponent } from './match-overview.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [MatchOverviewComponent],
  imports: [
    ThemeModule,
    CommonModule,
  ]
})
export class MatchOverviewModule { }
