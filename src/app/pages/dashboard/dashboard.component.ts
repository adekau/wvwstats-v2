import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatchService } from '../../@core/services/match.service';
import { Observable, Subscription, zip } from 'rxjs';
import { map, mergeMap, takeWhile } from 'rxjs/operators';
import { GW2Region } from '../../@core/enums/gw2region.enum';
import { MatchCollection } from '../../@core/collections/match.collection';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { GlickoService } from '../../@core/services/glicko.service';
import { WorldService } from '../../@core/services/world.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private alive: boolean = true;
  private matches$: Observable<MatchCollection>;
  subscription: Subscription;
  matches: MatchCollection;
  onRetrySubscription: Subscription;
  loading = true;

  // Settings for the Glicko rankings.
  settings = {
    hideSubHeader: true,
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
    pager: {
      display: false,
    },
    columns: {
      rank: {
        title: 'Rank',
        type: 'number',
        filter: false,
      },
      rankChange: {
        title: '',
        type: 'html',
        filter: false,
      },
      server: {
        title: 'Server',
        type: 'string',
        filter: false,
      },
      old_rating: {
        title: 'Current Rating',
        type: 'number',
        filter: false,
      },
      new_rating: {
        title: 'Predicted Rating',
        type: 'number',
        filter: false,
        sort: true,
        sortDirection: 'desc',
      },
      change: {
        title: 'Change',
        type: 'number',
        filter: false,
      },
    },
  };

  glickoTableSource: any[] = [];
  glickoTableLoading: boolean = true;

  constructor(
    protected matchService: MatchService,
    protected glickoService: GlickoService,
    protected worldService: WorldService,
    protected route: ActivatedRoute,
    private toast: NbToastrService,
  ) { }

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
      .subscribe(matches => {
        this.matches = matches;
        this.loading = false;
      }, this.showErrorToast);

    // subscribe to onRetry event of the match service
    // to show a message that a request will be retried.
    this.onRetrySubscription = this.matchService.onRetry
      .subscribe(status => this.showErrorToast.apply(this, [status]));

    // Subscription for glicko ranks table.
    zip(
      this.glickoService.glicko,
      this.worldService.worlds,
      this.route.url,
    )
      .pipe(
        takeWhile(() => this.alive),
        map(([gc, wc, url]) =>
          // ensure wc is defined or return empty array.
          wc ? gc.glickoRanks(this.regionFromString(url[0].path), wc) : []),
      )
      .subscribe(res => {
        this.glickoTableSource = res;
        this.glickoTableLoading = false;
      });
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

  showErrorToast(status) {
    this.toast.danger(
      `Failed to update match data, try checking your network connection.
       Will try updating again in 15 seconds.`,
      `Network Error (Error code: ${status})`,
      {
        duration: 7500,
      },
    );
  }

  ngOnDestroy() {
    this.alive = false;
    this.subscription.unsubscribe();
    this.onRetrySubscription.unsubscribe();
  }
}
