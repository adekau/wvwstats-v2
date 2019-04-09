import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map, takeWhile, delay, tap, take } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable, combineLatest } from 'rxjs';
import { NbThemeService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatchArchiveService } from '../../@core/services/match-archive.service';
import { MatchArchiveScoresCollection } from '../../@core/collections/matcharchive/matcharchive-scores.collection';
import { MatchServerRank } from '../../@core/enums/matchserverrank.enum';

@Component({
  selector: 'ngx-match-overview',
  templateUrl: './match-overview.component.html',
  styleUrls: ['./match-overview.component.scss'],
})
export class MatchOverviewComponent implements OnInit, AfterViewInit {
  match$: Observable<Match>;
  echartsInstance: any;
  private alive = true;
  option: any;
  scoresChartData: any;

  minuteStep = 15;
  timeStart: NgbTimeStruct;
  timeEnd: NgbTimeStruct;

  source: LocalDataSource = new LocalDataSource();

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
    public archive: MatchArchiveService,
    private theme: NbThemeService,
  ) { }

  ngOnInit() {
    this.match$ = combineLatest(
      this.matchService.matches,
      this.route.paramMap,
    ).pipe(
      tap(([_, params]) => {
        this.matchService.matchKdData(this.selectedRegion(params), parseInt(params.get('tier'), 10))
          .subscribe((data) => this.source.load(data));
      }),
      map(([matches, params]) =>
        matches.find(this.selectedRegion(params), parseInt(params.get('tier'), 10))),
      tap((match) => this.getChartData(match)),
    );
  }

  ngAfterViewInit(): void {
    this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
      )
      .subscribe(config => {
        const eTheme: any = config.variables.orders;

        this.setOptions(eTheme);
      });
  }

  setOptions(eTheme) {
    this.option = {
      grid: {
        left: 40,
        top: 20,
        right: 0,
        bottom: 40,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: eTheme.tooltipLineColor,
            width: eTheme.tooltipLineWidth,
          },
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontSize: eTheme.tooltipFontSize,
          fontWeight: eTheme.tooltipFontWeight,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: 3,
        formatter: (params) => {
          return Math.round(parseInt(params.value, 10));
        },
        extraCssText: eTheme.tooltipExtraCss,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 5,
        data: [],
        axisTick: {
          show: true,
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '2',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            width: '1',
          },
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          fontSize: eTheme.axisFontSize,
        },
        axisTick: {
          show: false,
        },
        splitLine: {

          lineStyle: {
            color: eTheme.yAxisSplitLine,
            width: '1',
          },
        },
      },
      series: [
      ],
    };
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

  onChartInit(echarts) {
    this.echartsInstance = echarts;
  }

  getChartData(match: Match) {
    this.archive.scores(match).pipe(
      take(1),
    ).subscribe((scores: MatchArchiveScoresCollection) => {
      const data = [
        {
          type: 'line',
          color: 'green',
          data: scores.flattenTo(MatchServerRank.FIRST),
        }, {
          type: 'line',
          color: 'blue',
          data: scores.flattenTo(MatchServerRank.SECOND),
        }, {
          type: 'line',
          color: 'red',
          data: scores.flattenTo(MatchServerRank.THIRD),
        },
      ];

      this.scoresChartData = {
        series: data,
      };
    });
  }

}
