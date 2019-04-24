import { Component, ViewChild, Input } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { ServerPopoverComponent } from './server-popover/server-popover.component';
import { Match } from '../../../@core/models/match.model';

@Component({
  selector: 'ngx-timezone-picker',
  templateUrl: './timezone-picker.component.html',
  styleUrls: ['./timezone-picker.component.scss'],
})
export class TimezonePickerComponent {
  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  @Input() match: Match;

  serverPopoverComponent = ServerPopoverComponent;
}
