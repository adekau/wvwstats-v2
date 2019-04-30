import { Injectable, Inject } from '@angular/core';
import { MatchArchiveData, IMatchArchive } from '../models/matcharchive.model';
import { Observable, forkJoin } from 'rxjs';
import { Match } from '../models/match.model';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from './api.config';
import { shareReplay, map, tap } from 'rxjs/operators';
import { MatchArchiveScoresCollection } from '../collections/matcharchive/matcharchive-scores.collection';
import { MatchArchiveKillsCollection } from '../collections/matcharchive/matcharchive-kills.collection';
import { MatchArchiveDeathsCollection } from '../collections/matcharchive/matcharchive-deaths.collection';
import { MatchArchiveKDCollection } from '../collections/matcharchive/matcharchive-kd.collection';
import { MatchArchivePPTCollection } from '../collections/matcharchive/matcharchive-ppt.collection';
import { DEFAULT_BUFFER_SIZE } from './buffer.token';

@Injectable({
  providedIn: 'root',
})
export class MatchArchiveService extends MatchArchiveData {

  private scores$: any = {};
  private kills$: any = {};
  private deaths$: any = {};
  private ppt$: any = {};

  constructor(
    @Inject(DEFAULT_BUFFER_SIZE) private buffer: number,
    private http: HttpClient,
  ) {
    super();
  }

  scores(match: Match) {
    const key = match.id;

    if (!this.scores$[key]) {
      this.scores$[key] = this.requestMatchArchive('scores', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveScoresCollection(val)),
        shareReplay(this.buffer),
      );
    }

    return this.scores$[key];
  }

  reloadScores(match: Match) {
    const key = match.id;

    this.scores$[key] = null;
    return this.scores(match);
  }

  kills(match: Match) {
    const key = match.id;

    if (!this.kills$[key]) {
      this.kills$[key] = this.requestMatchArchive('kills', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveKillsCollection(val)),
        shareReplay(this.buffer),
      );
    }

    return this.kills$[key];
  }

  reloadKills(match: Match) {
    const key = match.id;

    this.kills$[key] = null;
    return this.kills(match);
  }

  deaths(match: Match) {
    const key = match.id;

    if (!this.deaths$[key]) {
      this.deaths$[key] = this.requestMatchArchive('deaths', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveDeathsCollection(val)),
        shareReplay(this.buffer),
      );
    }

    return this.deaths$[key];
  }

  reloadDeaths(match: Match) {
    const key = match.id;

    this.deaths$[key] = null;
    return this.deaths(match);
  }

  kd(match: Match) {
    return forkJoin(
      this.kills(match),
      this.deaths(match),
    ).pipe(
      map(([kills, deaths]: [MatchArchiveKillsCollection, MatchArchiveDeathsCollection]) =>
        new MatchArchiveKDCollection(kills, deaths),
      ),
    );
  }

  reloadKd(match: Match) {
    return forkJoin(
      this.reloadKills(match),
      this.reloadDeaths(match),
    ).pipe(
      map(([kills, deaths]: [MatchArchiveKillsCollection, MatchArchiveDeathsCollection]) =>
        new MatchArchiveKDCollection(kills, deaths),
      ),
    );
  }

  ppt(match: Match) {
    const key = match.id;

    if (!this.ppt$[key]) {
      this.ppt$[key] = this.requestMatchArchive('ppt', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchivePPTCollection(val)),
        shareReplay(this.buffer),
      );
    }

    return this.ppt$[key];
  }

  reloadPpt(match: Match) {
    const key = match.id;

    this.ppt$[key] = null;
    return this.ppt(match);
  }

  requestMatchArchive(data: string, match: Match): Observable<Array<IMatchArchive>> {
    return this.http.get<IMatchArchive[]>(API_ROUTES.matchArchive, {
      params: {
        data: data,
        start_time: new Date(
          new Date(match.start_time).getTime() + (60e3 * 15),
        ).toISOString().replace('.000', ''),
        end_time: match.end_time,
        match: match.id,
      },
    });
  }
}
