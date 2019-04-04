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
import { GW2Region } from '../enums/gw2region.enum';
import { GW2MapType } from '../enums/gw2maptype.enum';
import { Map } from '../models/maps.model';

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

  matchKdData(region: GW2Region, tier: number) {
    return this.matches.pipe(
      map(mc => {
        const match = mc.find(region, tier);
        const redbl = this.findMap(match.maps, GW2MapType.RedBL);
        const bluebl = this.findMap(match.maps, GW2MapType.BlueBL);
        const greenbl = this.findMap(match.maps, GW2MapType.GreenBL);
        const ebg = this.findMap(match.maps, GW2MapType.EBG);

        return [
          {
            server: `${match.matchWorlds.green.name} (Green)`,
            kd: (match.kills.green / match.deaths.green).toFixed(2),
            ebg: (ebg.kills.green / ebg.deaths.green).toFixed(2),
            red: (redbl.kills.green / redbl.deaths.green).toFixed(2),
            blue: (bluebl.kills.green / bluebl.deaths.green).toFixed(2),
            green: (greenbl.kills.green / greenbl.deaths.green).toFixed(2),
          }, {
            server: `${match.matchWorlds.blue.name} (Blue)`,
            kd: (match.kills.blue / match.deaths.blue).toFixed(2),
            ebg: (ebg.kills.blue / ebg.deaths.blue).toFixed(2),
            red: (redbl.kills.blue / redbl.deaths.blue).toFixed(2),
            blue: (bluebl.kills.blue / bluebl.deaths.blue).toFixed(2),
            green: (greenbl.kills.blue / greenbl.deaths.blue).toFixed(2),
          }, {
            server: `${match.matchWorlds.red.name} (Red)`,
            kd: (match.kills.red / match.deaths.red).toFixed(2),
            ebg: (ebg.kills.red / ebg.deaths.red).toFixed(2),
            red: (redbl.kills.red / redbl.deaths.red).toFixed(2),
            blue: (bluebl.kills.red / bluebl.deaths.red).toFixed(2),
            green: (greenbl.kills.red / greenbl.deaths.red).toFixed(2),
          },
        ];
      }),
    );
  }

  private findMap(maps: Array<Map>, type: GW2MapType) {
    return maps.find(singleMap => singleMap.type === type);
  }

  requestMatches(): Observable<MatchCollection> {
    return forkJoin(
      this.worlds.worlds,
      this.objectives.objectives,
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
            // basically just delay it until the timer goes off again.
            // This observable will be unsubscribed from by switchMap above.
            delay(15000),
          );
        }),
        map(res => new MatchCollection(res, worlds, objectives)),
      );
  }
}
