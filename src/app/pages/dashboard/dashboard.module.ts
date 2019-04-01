import { NgModule } from '@angular/core';

// import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
