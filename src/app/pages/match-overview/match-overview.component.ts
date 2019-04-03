import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Match } from '../../@core/models/match.model';
import { map, takeWhile, delay, tap } from 'rxjs/operators';
import { MatchService } from '../../@core/services/match.service';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { Observable, combineLatest } from 'rxjs';
import { NbThemeService } from '@nebular/theme';

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

  data;

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
      },
      kd: {
        title: 'Total',
        filter: false,
      },
      ebg: {
        title: 'EBG',
        filter: false,
      },
      red: {
        title: 'Red BL',
        filter: false,
      },
      blue: {
        title: 'Blue BL',
        filter: false,
      },
      green: {
        title: 'Green BL',
        filter: false,
      },
    },
  };

  constructor(
    public route: ActivatedRoute,
    public matchService: MatchService,
    private theme: NbThemeService,
  ) {
  }

  ngOnInit() {
    this.data = [];
    this.match$ = combineLatest(
      this.matchService.matches,
      this.route.paramMap,
    ).pipe(
      map(([matches, params]) =>
        matches.find(this.selectedRegion(params), parseInt(params.get('tier'), 10))),
      tap(this.generateKdData),
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
          show: false,
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
        {
          data: [100, 250, 600, 710, 840],
          type: 'line',
        },
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
  
  generateKdData(match: Match) {
    console.log(this.data);
    this.data = [
      {
        server: match.matchWorlds.green.name,
        kd: match.kills.green / match.deaths.green,
        ebg: 0,
        red: 0,
        blue: 0,
        green: 0,
      },
    ];
  }

}
