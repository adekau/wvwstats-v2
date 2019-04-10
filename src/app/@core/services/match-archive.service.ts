import { Injectable } from '@angular/core';
import { MatchArchiveData, IMatchArchive } from '../models/matcharchive.model';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from './api.config';
import { shareReplay, map, tap } from 'rxjs/operators';
import { MatchArchiveScoresCollection } from '../collections/matcharchive/matcharchive-scores.collection';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchArchiveService extends MatchArchiveData {

  private scores$: any = {};

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
        tap((t) => console.log(t)),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.scores$[key];
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
