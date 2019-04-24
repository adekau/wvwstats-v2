import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';
import { ThemeModule } from '../../@theme/theme.module';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    ThemeModule,
    LeafletModule.forRoot(),
  ],
  providers: [
    LeafletDirective,
  ],
})
export class MapModule { }
