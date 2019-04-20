import { Component, Input } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { Match } from '../../../../@core/models/match.model';

@Component({
  selector: 'ngx-server-popover',
  templateUrl: './server-popover.component.html',
  styleUrls: ['./server-popover.component.scss'],
})
export class ServerPopoverComponent {
  @Input() popover: NbPopoverDirective;
  @Input() match: Match;

  handleClick(server) {
    console.log(server);
    this.popover.hide();
  }
}
