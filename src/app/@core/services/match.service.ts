import { Injectable } from '@angular/core';
import { API_ROUTES } from './api.config';
import { Match, MatchData } from '../models/match.model';
import { Observable, timer } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class MatchService extends MatchData {
  private matches$: Observable<Match[]>;

  constructor(private http: HttpClient) {
    super();
  }

  get matches(): Observable<Match[]> {
    if (!this.matches$) {
      const timer$ = timer(0, 10000);
      this.matches$ = timer$.pipe(
        switchMap(_ => this.requestMatches()),
        shareReplay(BUFFER_SIZE),
      );
    }

    return this.matches$;
  }

  requestMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(API_ROUTES.allMatches);
  }
}
