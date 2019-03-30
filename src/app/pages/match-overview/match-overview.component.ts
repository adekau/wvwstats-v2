import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { switchMap, map } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss'],
})
export class MatchOverviewComponent implements OnInit {
  match$: Observable<Match>;
  params: ParamMap;

  constructor(
    public route: ActivatedRoute,
    public matchService: MatchService,
  ) { }

  ngOnInit() {
    this.match$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.params = params;
        return this.matchService.matches;
      }),
      map(matches => matches.find(this.selectedRegion, parseInt(this.params.get('tier'), 10))),
    );
  }

  get selectedRegion(): GW2Region {
    if (this.params && this.params.has('region')) {
      const region = this.params.get('region');
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
