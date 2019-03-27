import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ObjectiveData, IObjective } from '../models/objective.model';
import { Observable } from 'rxjs';
import { ObjectiveCollection } from '../collections/objective.collection';
import { API_ROUTES } from './api.config';
import { map, shareReplay } from 'rxjs/operators';

const BUFFER_SIZE: number = 1;

@Injectable({
  providedIn: 'root',
})
export class ObjectiveService extends ObjectiveData {
  private objectives$: Observable<ObjectiveCollection>;

  constructor(
    private http: HttpClient,
  ) {
    super();
  }

  get objectives(): Observable<ObjectiveCollection> {
    if (!this.objectives$) {
      this.objectives$ = this.requestData().pipe(
        shareReplay(BUFFER_SIZE),
      )
    }

    return this.objectives$;
  }

  requestData(): Observable<ObjectiveCollection> {
    return this.http.get<IObjective[]>(API_ROUTES.allObjectives).pipe(
      map(res => new ObjectiveCollection(res)),
    );
  }

}
