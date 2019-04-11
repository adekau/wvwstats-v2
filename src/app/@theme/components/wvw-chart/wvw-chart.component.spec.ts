import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WvwChartComponent } from './wvw-chart.component';

describe('WvwChartComponent', () => {
  let component: WvwChartComponent;
  let fixture: ComponentFixture<WvwChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WvwChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WvwChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
