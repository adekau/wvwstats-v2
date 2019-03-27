import { Injectable } from '@angular/core';
import { API_ROUTES } from './api.config';
import { IMatch, MatchData } from '../models/match.model';
import { Observable, timer, merge } from 'rxjs';
import { shareReplay, switchMap, map, concatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatchCollection } from '../collections/match.collection';
import { WorldService } from './world.service';
import { ObjectiveService } from './objective.service';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchService extends MatchData {
  private matches$: Observable<MatchCollection>;

  constructor(
    private http: HttpClient,
    public worlds: WorldService,
    public objectives: ObjectiveService,
  ) {
    super();
  }

  get matches(): Observable<MatchCollection> {
    if (!this.matches$) {
      const timer$ = timer(0, 15000);
      this.matches$ = timer$.pipe(
        switchMap(_ => this.requestMatches()),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.matches$;
  }

  requestMatches(): Observable<MatchCollection> {
    return this.worlds
      .requestWorlds()
      .pipe(
        concatMap(worlds =>
          this.objectives.requestData().pipe(
            concatMap(objectives =>
              this.http
                .get<IMatch[]>(API_ROUTES.allMatches)
                .pipe(map(res => new MatchCollection(res, worlds, objectives)))
            )
          )
        ),
      );
  }
}
