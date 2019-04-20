import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { SearchResultsComponent } from './search-results.component';

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    ThemeModule,
    CommonModule,
  ],
})
export class SearchResultsModule { }
