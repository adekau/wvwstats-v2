import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private online$: Observable<Event>;
  private offline$: Observable<Event>;

  constructor() {
    this.online$ = fromEvent(window, 'online');
    this.offline$ = fromEvent(window, 'offline');
  }

  get online() {
    return this.online$;
  }

  get offline() {
    return this.offline$;
  }
}
