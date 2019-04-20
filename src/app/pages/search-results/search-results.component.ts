import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'ngx-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private alive: boolean = true;
  term: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        takeWhile(() => this.alive),
      )
      .subscribe(obj => this.term = obj.term);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
