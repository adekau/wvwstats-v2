import { Injectable } from '@angular/core';
import { MatchArchiveData, IMatchArchive } from '../models/matcharchive.model';
import { Observable } from 'rxjs';
import { GW2Region } from '../enums/gw2region.enum';
import { Match } from '../models/match.model';
import { HttpClient } from '@angular/common/http';
import { API_ROUTES } from './api.config';
import { shareReplay } from 'rxjs/operators';

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
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.scores$[key];
  }

  requestMatchArchive(data: string, match: Match): Observable<Array<IMatchArchive>> {
    return this.http.get<IMatchArchive[]>(API_ROUTES.matchArchive, {
      params: {
        data: data,
        start_time: match.start_time,
        end_time: match.end_time,
        match: match.id,
      },
    });
  }
}
