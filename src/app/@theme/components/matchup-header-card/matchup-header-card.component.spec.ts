import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupHeaderCardComponent } from './matchup-header-card.component';

describe('MatchupHeaderCardComponent', () => {
  let component: MatchupHeaderCardComponent;
  let fixture: ComponentFixture<MatchupHeaderCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupHeaderCardComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupHeaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
