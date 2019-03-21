import {Component, OnDestroy} from '@angular/core';
import { takeWhile } from 'rxjs/operators' ;
import { SolarData } from '../../@core/data/solar';

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
