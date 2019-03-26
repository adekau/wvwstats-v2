import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchService } from '../../@core/services/match.service';
import { Observable, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { MatchCollection } from '../../@core/collections/match.collection';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private matches$: Observable<MatchCollection>;
  subscription: Subscription;
  matches: MatchCollection;

  constructor(
    protected matchService: MatchService,
    protected route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.matches$ = this.matchService.matches;
    this.subscription = this.route.url
      .pipe(
        mergeMap(reg =>
          this.matches$.pipe(
            map(matches => matches.region(this.regionFromString(reg[0].path))),
          ),
        ),
      )
      .subscribe(matches => (this.matches = matches));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regionFromString(str: string): GW2Region {
    if (str === 'na') {
      return GW2Region.NA;
    } else if (str === 'eu') {
      return GW2Region.EU;
    } else {
      throw new Error('Unknown region string entered.');
    }
  }
}
