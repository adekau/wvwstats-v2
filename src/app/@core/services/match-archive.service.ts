import { Injectable } from '@angular/core';
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

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchArchiveService extends MatchArchiveData {

  private scores$: any = {};
  private kills$: any = {};
  private deaths$: any = {};
  private ppt$: any = {};

  constructor(
    private http: HttpClient,
  ) {
    super();
  }

  scores(match: Match) {
    const key = match.id;

    if (!this.scores$[key]) {
      this.scores$[key] = this.requestMatchArchive('scores', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveScoresCollection(val)),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.scores$[key];
  }

  kills(match: Match) {
    const key = match.id;

    if (!this.kills$[key]) {
      this.kills$[key] = this.requestMatchArchive('kills', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveKillsCollection(val)),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.kills$[key];
  }

  deaths(match: Match) {
    const key = match.id;

    if (!this.deaths$[key]) {
      this.deaths$[key] = this.requestMatchArchive('deaths', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchiveDeathsCollection(val)),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.deaths$[key];
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

  ppt(match: Match) {
    const key = match.id;

    if (!this.ppt$[key]) {
      this.ppt$[key] = this.requestMatchArchive('ppt', match).pipe(
        map((val: IMatchArchive[]) => new MatchArchivePPTCollection(val)),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.ppt$[key];
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
