import { Injectable } from '@angular/core';
import { API_ROUTES } from './api.config';
import { IMatch, AllMatches, MatchData } from '../models/match.model';
import { Observable, timer } from 'rxjs';
import { shareReplay, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchService extends MatchData {
  private matches$: Observable<AllMatches>;

  constructor(private http: HttpClient) {
    super();
  }

  get matches(): Observable<AllMatches> {
    if (!this.matches$) {
      const timer$ = timer(0, 10000);
      this.matches$ = timer$.pipe(
        switchMap(_ => this.requestMatches()),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.matches$;
  }

  requestMatches(): Observable<AllMatches> {
    return this.http.get<IMatch[]>(API_ROUTES.allMatches).pipe(
      map(res => new AllMatches(res)),
    );
  }
}
