import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatchService } from '../../@core/services/match.service';
import { AllMatches } from '../../@core/models/match.model';
import { Observable, Subscription } from 'rxjs';
import { GW2Region } from '../../@core/enums/gw2region.enum';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {
  private matches$: Observable<AllMatches>;
  private subscription: Subscription;

  constructor(protected matchService: MatchService) { }

  ngOnInit() {
    this.matches$ = this.matchService.matches;
    this.subscription = this.matches$.subscribe((res: AllMatches) => console.log(res.find(GW2Region.EU, 3).start));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
