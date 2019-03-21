import {Component, OnDestroy} from '@angular/core';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  constructor() {
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
