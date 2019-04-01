import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'ngx-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss'],
})
export class MatchOverviewComponent implements OnInit {
  match$: Observable<Match>;

  constructor(
    public route: ActivatedRoute,
    public matchService: MatchService,
  ) { }

  ngOnInit() {
    this.match$ = combineLatest(
      this.matchService.matches,
      this.route.paramMap,
    ).pipe(
      map(([matches, params]) =>
        matches.find(this.selectedRegion(params), parseInt(params.get('tier'), 10))),
    );
  }

  selectedRegion(params: ParamMap): GW2Region {
    if (params && params.has('region')) {
      const region = params.get('region');
      if (region.toLowerCase() === 'na') {
        return GW2Region.NA;
      } else if (region.toLowerCase() === 'eu') {
        return GW2Region.EU;
      } else {
        throw new Error('Unknown region provided.');
      }
    } else {
      throw new Error('No region provided.');
    }
  }

}
