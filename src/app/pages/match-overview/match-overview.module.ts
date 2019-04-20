import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchOverviewComponent } from './match-overview.component';
import { ThemeModule } from '../../@theme/theme.module';
import { TimezonePickerComponent } from './timezone-picker/timezone-picker.component';
import { ServerPopoverComponent } from './timezone-picker/server-popover/server-popover.component';

@NgModule({
  declarations: [MatchOverviewComponent, TimezonePickerComponent, ServerPopoverComponent],
  imports: [
    ThemeModule,
    CommonModule,
  ],
  entryComponents: [ServerPopoverComponent],
})
export class MatchOverviewModule { }
