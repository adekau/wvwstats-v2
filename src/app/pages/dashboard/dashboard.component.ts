import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatchService } from '../../@core/services/match.service';
import { Match } from '../../@core/models/match.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private matches$: Observable<Match[]>;
  private subscription: Subscription;

  constructor(protected matchService: MatchService) { }

  ngOnInit() {
    this.matches$ = this.matchService.matches;
    this.subscription = this.matches$.subscribe(res => console.log(res));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
