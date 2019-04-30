import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { IGlicko } from '../models/glicko.model';
import { API_ROUTES } from './api.config';
import { GlickoCollection } from '../collections/glicko.collection';
import { map, switchMap, shareReplay } from 'rxjs/operators';
import { DEFAULT_BUFFER_SIZE } from './buffer.token';

const ONE_SEC = 1e3;
const ONE_MIN = ONE_SEC * 60;

@Injectable({
  providedIn: 'root',
})
export class GlickoService {
  private glicko$: Observable<GlickoCollection>;

  constructor(
    @Inject(DEFAULT_BUFFER_SIZE) private buffer: number,
    private http: HttpClient,
  ) { }

  get glicko() {
    if (!this.glicko$) {
      const timer$ = timer(0, ONE_MIN * 3);
      this.glicko$ = timer$
        .pipe(
          switchMap(_ => this.requestGlicko()),
          shareReplay(this.buffer),
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
