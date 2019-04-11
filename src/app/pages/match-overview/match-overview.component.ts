import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map, tap, take, takeWhile, delay } from 'rxjs/operators';
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
export class MatchOverviewComponent implements AfterViewInit {
  match$: Observable<Match>;
  echartsInstance: any;
  private alive = true;
  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Save as PNG',
        },
        dataView: {
          title: 'Table View',
          lang: ['Table View', 'Close', 'Refresh'],
          readOnly: true,
        },
        dataZoom: {
          yAxisIndex: 'none',
          title: {
            zoom: 'Zoom Selection',
            back: 'Undo Zoom',
          },
        },
        restore: {
          title: 'Reset',
        },
      },
    },
    dataZoom: {
      type: 'slider',
      show: true,
      realtime: true,
      start: 0,
      end: 100,
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: true,
      },
    },
    series: [
    ],
  };

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

  ngAfterViewInit(): void {
    this.match$ = combineLatest(
      this.matchService.matches,
      this.route.paramMap,
      this.echartsThemeSettings(),
    ).pipe(
      tap(([_, params]) => {
        this.matchService.matchKdData(this.selectedRegion(params), parseInt(params.get('tier'), 10))
          .subscribe((data) => this.source.load(data));
      }),
      map(([matches, params, theme]) => {
        const match = matches
          .find(
            this.selectedRegion(params),
            parseInt(params.get('tier'), 10),
          );
        this.getChartData(match, theme);
        return match;
      }),
    );
  }

  private echartsThemeSettings() {
    return this.theme.getJsTheme()
      .pipe(
        takeWhile(() => this.alive),
        delay(1),
        map(config => config.variables.echarts)
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

  onChartInit(echarts) {
    this.echartsInstance = echarts;
  }

  getChartData(match: Match, theme: any) {
    console.log(theme);
    this.archive.scores(match).pipe(
      take(1),
    ).subscribe((scores: MatchArchiveScoresCollection) => {
      const data = [
        {
          name: match.matchWorlds.green.name,
          type: 'line',
          // color: 'green',
          data: scores.flattenTo(MatchServerRank.FIRST),
        }, {
          name: match.matchWorlds.blue.name,
          type: 'line',
          // color: 'blue',
          data: scores.flattenTo(MatchServerRank.SECOND),
        }, {
          name: match.matchWorlds.red.name,
          type: 'line',
          // color: 'red',
          data: scores.flattenTo(MatchServerRank.THIRD),
        },
      ];

      this.scoresChartData = {
        legend: {
          left: 0,
          textStyle: {
            color: theme.textColor,
          },
          data: [
            match.matchWorlds.green.name,
            match.matchWorlds.blue.name,
            match.matchWorlds.red.name,
          ],
        },
        toolbox: {
          iconStyle: {
            borderColor: theme.lightTextColor,
            emphasis: {
              borderColor: theme.emphasisTextColor,
            },
          },
          feature: {
            dataView: {
              backgroundColor: theme.bg,
              textareaColor: theme.bg,
              textColor: theme.textColor,
              textareaBorderColor: theme.axisLineColor,
            }
          },
        },
        tooltip: {
          textStyle: {
            color: theme.tooltipTextColor,
          },
          axisPointer: {
            lineStyle: {
              color: theme.axisLineColor,
            },
            crossStyle: {
              color: theme.axisLineColor,
            },
            label: {
              color: theme.tooltipTextColor,
              backgroundColor: theme.tooltipBackgroundColor,
              shadowColor: theme.itemHoverShadowColor,
            },
          },
          backgroundColor: theme.tooltipBackgroundColor,
        },
        dataZoom: {
          dataBackground: {
            lineStyle: {
              color: theme.sliderLineColor,
            },
            areaStyle: {
              color: theme.sliderLineArea,
            },
          },
          textStyle: {
            color: theme.textColor,
          },
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: theme.axisLineColor,
            },
          },
          axisLabel: {
            color: theme.lightTextColor,
          },
          data: scores.snapshotTimes.map(t => new Date(t).toLocaleString()),
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              color: theme.splitLineColor,
            },
          },
          axisLine: {
            lineStyle: {
              color: theme.axisLineColor,
            },
          },
          axisLabel: {
            color: theme.lightTextColor,
          },
        },
        color: theme.color,
        series: data,
      };
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
