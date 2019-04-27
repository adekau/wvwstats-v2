import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map, tap, takeWhile, delay, shareReplay } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable, combineLatest } from 'rxjs';
import { NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { GraphsComponent } from '../graphs/graphs.component';

@Component({
  selector: 'ngx-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss'],
})
export class MatchOverviewComponent implements AfterViewInit, OnDestroy {
  match$: Observable<Match>;
  private alive = true;
  jstheme: any;

  minuteStep = 15;
  timeStart: NgbTimeStruct;
  timeEnd: NgbTimeStruct;

  source: LocalDataSource = new LocalDataSource();
  kdTableLoading = true;
  loading = true;

  // Settings for KDR data table.
  settings = {
    hideSubHeader: true,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
    columns: {
      server: {
        title: 'Server',
        type: 'string',
        filter: false,
      },
      kd: {
        title: 'Total',
        type: 'number',
        filter: false,
        sort: true,
        sortDirection: 'desc',
      },
      activity: {
        title: 'Activity',
        type: 'number',
        filter: false,
      },
      ebg: {
        title: 'EBG',
        type: 'number',
        filter: false,
      },
      red: {
        title: 'Red BL',
        type: 'number',
        filter: false,
      },
      blue: {
        title: 'Blue BL',
        type: 'number',
        filter: false,
      },
      green: {
        title: 'Green BL',
        type: 'number',
        filter: false,
      },
    },
  };

  constructor(
    public route: ActivatedRoute,
    public matchService: MatchService,
    private theme: NbThemeService,
    private windowService: NbWindowService,
  ) { }

  ngAfterViewInit(): void {
    this.match$ = combineLatest(
      this.matchService.matches,
      this.route.paramMap,
      this.echartsThemeSettings(),
    ).pipe(
      tap(([_, params]) => {
        this.matchService.matchKdData(this.selectedRegion(params), parseInt(params.get('tier'), 10))
          .subscribe((data) => {
            this.source.load(data);
            this.kdTableLoading = false;
            this.loading = false;
          });
      }),
      map(([matches, params, theme]) => {
        const match = matches
          .find(
            this.selectedRegion(params),
            parseInt(params.get('tier'), 10),
          );
        this.jstheme = theme;
        return match;
      }),
      shareReplay(1),
    );
  }

  private echartsThemeSettings() {
    return this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
        map(config => config.variables.echarts),
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

  ngOnDestroy() {
    this.alive = false;
  }

  openGraphs() {
    this.windowService.open(GraphsComponent, { title: 'Graphs' });
  }
}
