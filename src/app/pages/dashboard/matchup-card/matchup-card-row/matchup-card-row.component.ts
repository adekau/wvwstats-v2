import { Component, OnInit, Input } from '@angular/core';
import { Match } from '../../../../@core/models/match.model';
import { IServerMatchInfo } from '../../../../@core/models/servermatchinfo.model';

@Component({
  selector: 'ngx-matchup-card-row',
  templateUrl: './matchup-card-row.component.html',
  styleUrls: ['./matchup-card-row.component.scss'],
})
export class MatchupCardRowComponent implements OnInit {
  @Input() rank: number;
  @Input() match: Match;

  rankColor: string = '';
  info: IServerMatchInfo;

  constructor() { }

  ngOnInit() {
    this.rankColor = this.getRankColor();
    if (this.match) {
      this.info = this.match.getServerMatchInfo(this.getServerColor());
    }
  }

  getRankColor() {
    if (this.rank === 1) {
      return 'success';
    } else if (this.rank === 2) {
      return 'info';
    } else if (this.rank === 3) {
      return 'danger lowscore';
    } else {
      throw new Error('Invalid rank provided to matchup-card-row.');
    }
  }

  getServerColor() {
    if (this.rank === 1) {
      return 'green';
    } else if (this.rank === 2) {
      return 'blue';
    } else if (this.rank === 3) {
      return 'red';
    } else {
      throw new Error('Invalid rank provided to matchup-card-row.');
    }
  }
}
