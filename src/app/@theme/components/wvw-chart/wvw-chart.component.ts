import { Component, Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { MatchArchiveService } from '../../../@core/services/match-archive.service';
import { Match } from '../../../@core/models/match.model';
import { MatchServerRank } from '../../../@core/enums/matchserverrank.enum';
import { take } from 'rxjs/operators';
import { MatchArchiveCollection } from '../../../@core/collections/matcharchive/matcharchive.collection';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-wvw-chart',
  templateUrl: './wvw-chart.component.html',
  styleUrls: ['./wvw-chart.component.scss'],
})
export class WvwChartComponent implements OnInit, OnChanges {
  @Input() match: Match;
  @Input() data: string;
  @Input() theme: any;
  @Output() init = new EventEmitter<WvwChartComponent>();

  loadingOptions = {
    text: 'Loading',
    color: '#4ca6ff',
    textColor: '#fff',
    maskColor: 'rgba(0, 0, 0, 0.35)',
    zlevel: 0,
  };

  options = {
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

  private echartsInstance: any;
  dynamicChartOpts: any;

  constructor(
    private archive: MatchArchiveService,
  ) { }

  ngOnInit() {
    this.init.emit(this);
  }

  ngOnChanges() {
    if (this.echartsInstance) {
      this.getChartData();
    }
  }

  getChartData() {
    const { match } = this;
    this.echartsInstance.showLoading('default', this.loadingOptions);
    if (this.data.toLowerCase() === 'scores') {
      this.getChart(this.archive.scores(match));
    } else if (this.data.toLowerCase() === 'kd') {
      this.getChart(this.archive.kd(match));
    } else if (this.data.toLowerCase() === 'ppt') {
      this.getChart(this.archive.ppt(match));
    } else {
      throw new Error('Invalid chart data type.');
    }
  }

  reloadChart() {
    const { match } = this;
    this.echartsInstance.showLoading('default', this.loadingOptions);
    if (this.data.toLowerCase() === 'scores') {
      this.getChart(this.archive.reloadScores(match));
    } else if (this.data.toLowerCase() === 'kd') {
      this.getChart(this.archive.reloadKd(match));
    } else if (this.data.toLowerCase() === 'ppt') {
      this.getChart(this.archive.reloadPpt(match));
    } else {
      throw new Error('Invalid chart data type.');
    }
  }

  getChart(obs: Observable<MatchArchiveCollection>) {
    obs.pipe(
      take(1),
    ).subscribe(this.handleChartRender.bind(this));
  }

  handleChartRender(col: MatchArchiveCollection) {
    const match = this.match;
    const theme = this.theme;

    const data = [
      {
        name: match.matchWorlds.green.name,
        type: 'line',
        data: col.flattenTo(MatchServerRank.FIRST),
      }, {
        name: match.matchWorlds.blue.name,
        type: 'line',
        data: col.flattenTo(MatchServerRank.SECOND),
      }, {
        name: match.matchWorlds.red.name,
        type: 'line',
        data: col.flattenTo(MatchServerRank.THIRD),
      },
    ];

    this.dynamicChartOpts = {
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
          },
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
        data: col.snapshotTimes.map(t => new Date(t).toLocaleString()),
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

    this.echartsInstance.hideLoading();
  }

  onChartInit(inst) {
    this.echartsInstance = inst;
    this.getChartData();
  }

}
