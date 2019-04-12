import { Component, Input, AfterViewInit } from '@angular/core';
import { MatchArchiveService } from '../../../@core/services/match-archive.service';
import { Match } from '../../../@core/models/match.model';

@Component({
  selector: 'ngx-wvw-chart',
  templateUrl: './wvw-chart.component.html',
  styleUrls: ['./wvw-chart.component.scss'],
})
export class WvwChartComponent implements AfterViewInit {
  @Input() match: Match;
  @Input() theme: any;

  constructor(
    private archive: MatchArchiveService,
  ) { }

  ngAfterViewInit() {
  }

}
