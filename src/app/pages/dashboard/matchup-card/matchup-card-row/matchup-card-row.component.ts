import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-matchup-card-row',
  templateUrl: './matchup-card-row.component.html',
  styleUrls: ['./matchup-card-row.component.scss'],
})
export class MatchupCardRowComponent implements OnInit {

  @Input('rank') rank: number;

  protected rankColor: string = '';

  constructor() { }

  ngOnInit() {
    this.rankColor = this.getRankColor();
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

}
