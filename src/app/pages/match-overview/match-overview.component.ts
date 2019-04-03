import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable, combineLatest } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss'],
})
export class MatchOverviewComponent implements OnInit {
  match$: Observable<Match>;
  timezoneMenu = [
    { title: 'Red' },
    { title: 'Blue' },
    { title: 'Green' },
  ];

  data = [
    {
      server: 'Blackgate',
      kills: 34000,
      deaths: 17000,
      activity: 51000,
    }, {
      server: 'Anvil Rock',
      kills: 13000,
      deaths: 23000,
      activity: 36000,
    }, {
      server: 'Sea of Sorrows',
      kills: 15000,
      deaths: 34000,
      activity: 49000,
    },
  ];

  settings = {
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
    editor: {
      config: {
        completer: { searchFields: 'server', data: this.data },
      },
    },
    columns: {
      server: {
        title: 'Server',
        type: 'string',
        editable: false,
      },
      kills: {
        title: 'Kills',
        type: 'number',
        editable: false,
      },
      deaths: {
        title: 'Deaths',
        type: 'number',
        editable: false,
      },
      activity: {
        title: 'Activity',
        type: 'number',
        editable: false,
      },
    },
  };

  constructor(
    public route: ActivatedRoute,
    public matchService: MatchService,
  ) {
  }

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
