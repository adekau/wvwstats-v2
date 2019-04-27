import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Match } from '../../../@core/models/match.model';

const NUMBER_OF_ROWS = 3;

@Component({
  selector: 'ngx-matchup-card',
  templateUrl: './matchup-card.component.html',
  styleUrls: ['./matchup-card.component.scss'],
})
export class MatchupCardComponent {
  loading: boolean = true;
  loadedRows: number[] = [];
  @Input() match: Match;
  @Output() loadComplete = new EventEmitter<boolean>();

  handleLoad(event) {
    this.loadedRows[event] = 1;
    if (this.loadedRows.length === NUMBER_OF_ROWS) {
      this.loadComplete.emit(true);
      // fix expression changed after init error:
      Promise.resolve().then(() => {
        this.loading = false;
      });
    }
  }
}
