import { Component, OnInit, Input } from '@angular/core';
import { Match } from '../../../@core/models/match.model';

@Component({
  selector: 'ngx-matchup-card',
  templateUrl: './matchup-card.component.html',
  styleUrls: ['./matchup-card.component.scss'],
})
export class MatchupCardComponent implements OnInit {

  @Input() match: Match;

  constructor() { }

  ngOnInit() {}

}
