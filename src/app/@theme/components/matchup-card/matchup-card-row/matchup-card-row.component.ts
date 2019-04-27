import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Match } from '../../../../@core/models/match.model';
import { IServerMatchInfo } from '../../../../@core/models/servermatchinfo.model';
import { WorldCollection } from '../../../../@core/collections/world.collection';
import { MatchServerRank } from '../../../../@core/enums/matchserverrank.enum';
import { GlickoService } from '../../../../@core/services/glicko.service';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GlickoCollection } from '../../../../@core/collections/glicko.collection';

@Component({
  selector: 'ngx-matchup-card-row',
  templateUrl: './matchup-card-row.component.html',
  styleUrls: ['./matchup-card-row.component.scss'],
})
export class MatchupCardRowComponent implements OnInit, OnChanges {
  @Input() rank: number;
  @Input() match: Match;
  @Output() loaded = new EventEmitter<number>();

  serverColor: MatchServerRank;
  rankClass: string = '';
  info: IServerMatchInfo;
  region: string;
  tier: number;
  serverTooltip: string;
  winning: boolean;
  topKd: boolean;
  predictedGlicko: string;
  glickoDelta: string;

  constructor(
    private glicko: GlickoService,
  ) { }

  ngOnInit() {
    this.loadRow();
  }

  ngOnChanges() {
    this.loadRow();
  }

  loadRow() {
    this.initialLoad()
      .pipe(
        switchMap(_ => this.glicko.glicko),
      )
      .subscribe((gc: GlickoCollection) => {
        const glickoResult = gc.find(this.info.world.id);
        this.predictedGlicko = glickoResult.glicko.rating.toFixed(3);
        this.glickoDelta = glickoResult.glicko.delta.toFixed(3);
        this.loaded.emit(this.rank);
      });
  }

  initialLoad() {
    return new Observable((observer) => {
      this.serverColor = this.getServerColor();
      this.info = this.match.getServerMatchInfo(this.serverColor);
      this.rankClass = this.getRankColor();
      this.tier = parseInt(this.match.id.split('-')[1], 10);
      this.region = parseInt(this.match.id.split('-')[0], 10) === 1 ? 'na' : 'eu';
      this.serverTooltip = this.getServerTooltip();
      this.winning = this.getWinning();
      this.topKd = this.isTopKd();

      observer.next(true);
      observer.complete();
    });
  }

  getRankColor() {
    if (this.rank === 1) {
      return 'success';
    } else if (this.rank === 2) {
      return 'info';
    } else if (this.rank === 3) {
      return 'danger lowscore';
    } else {
      throw new Error('Invalid rank provided to matchup-card-row.');
    }
  }

  getServerColor() {
    if (this.rank === 1) {
      return MatchServerRank.FIRST;
    } else if (this.rank === 2) {
      return MatchServerRank.SECOND;
    } else if (this.rank === 3) {
      return MatchServerRank.THIRD;
    } else {
      throw new Error('Invalid rank provided to matchup-card-row.');
    }
  }

  getServerTooltip() {
    if (this.info) {
      return (<WorldCollection>(<unknown>this.info.all_worlds))
        .all()
        .map(world => world.name)
        .reverse()
        .join(' & ');
    } else {
      return '';
    }
  }

  getWinning() {
    return this.info.victory_points
      === Math.max(
        this.match.victory_points.red,
        this.match.victory_points.blue,
        this.match.victory_points.green,
      );
  }

  isTopKd() {
    return this.info.kd === Math.max(
      parseFloat((this.match.kills.green / this.match.deaths.green).toFixed(2)),
      parseFloat((this.match.kills.blue / this.match.deaths.blue).toFixed(2)),
      parseFloat((this.match.kills.red / this.match.deaths.red).toFixed(2)),
    );
  }
}
