import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { IGlicko } from '../models/glicko.model';
import { API_ROUTES } from './api.config';
import { GlickoCollection } from '../collections/glicko.collection';
import { map, switchMap, shareReplay } from 'rxjs/operators';

const BUFFER_SIZE = 1;

@Injectable({
  providedIn: 'root',
})
export class GlickoService {
  private glicko$: Observable<GlickoCollection>;

  constructor(
    private http: HttpClient,
  ) { }

  get glicko() {
    if (!this.glicko$) {
      const timer$ = timer(0, 60e3 * 3);
      this.glicko$ = timer$
        .pipe(
          switchMap(_ => this.requestGlicko()),
          shareReplay(BUFFER_SIZE),
        );
    }

    return this.glicko$;
  }

  requestGlicko(): Observable<GlickoCollection> {
    return this.http.get<IGlicko[]>(API_ROUTES.glicko)
      .pipe(
        map(response => new GlickoCollection(response)),
      );
  }

}
