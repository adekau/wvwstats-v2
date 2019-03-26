import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorldData, IWorld } from '../models/world.model';
import { Observable } from 'rxjs';
import { WorldCollection } from '../collections/world.collection';
import { API_ROUTES } from './api.config';
import { map, shareReplay } from 'rxjs/operators';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root'
})
export class WorldService extends WorldData {

  private worlds$: Observable<WorldCollection>;

  constructor(private http: HttpClient) {
    super();
  }

  get worlds(): Observable<WorldCollection> {
    if (!this.worlds$) {
      this.worlds$ = this.requestWorlds().pipe(
        shareReplay(BUFFER_SIZE),
      );
    } 
    
    return this.worlds$;
  }

  requestWorlds(): Observable<WorldCollection> {
    return this.http.get<IWorld[]>(API_ROUTES.allWorlds).pipe(
      map(res => new WorldCollection(res)),
    );
  }
}
