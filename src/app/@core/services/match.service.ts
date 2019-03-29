import { Injectable } from '@angular/core';
import { API_ROUTES } from './api.config';
import { IMatch, MatchData } from '../models/match.model';
import { Observable, timer, forkJoin, Subject } from 'rxjs';
import { shareReplay, switchMap, map, retryWhen, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatchCollection } from '../collections/match.collection';
import { WorldService } from './world.service';
import { ObjectiveService } from './objective.service';
import { ObjectiveCollection } from '../collections/objective.collection';
import { WorldCollection } from '../collections/world.collection';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchService extends MatchData {
  private matches$: Observable<MatchCollection>;
  private onRetry$: Subject<number>;

  constructor(
    private http: HttpClient,
    public worlds: WorldService,
    public objectives: ObjectiveService,
  ) {
    super();
    this.onRetry$ = new Subject();
  }

  get onRetry() {
    return this.onRetry$;
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
    return forkJoin(
      this.worlds.requestWorlds(),
      this.objectives.requestData(),
    ).pipe(
      switchMap(([worlds, objectives]) => this.rawMatches(worlds, objectives)),
    );
  }

  rawMatches(worlds: WorldCollection, objectives: ObjectiveCollection): Observable<any> {
    return this.http
      .get<IMatch[]>(API_ROUTES.allMatches)
      .pipe(
        retryWhen(err => {
          return err.pipe(
            tap(error => this.onRetry$.next(error.status)),
            delay(15000),
          )
        }),
        map(res => new MatchCollection(res, worlds, objectives)),
      );
  }
}
