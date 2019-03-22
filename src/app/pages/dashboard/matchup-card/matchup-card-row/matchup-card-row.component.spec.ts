import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchupCardRowComponent } from './matchup-card-row.component';

describe('MatchupCardRowComponent', () => {
  let component: MatchupCardRowComponent;
  let fixture: ComponentFixture<MatchupCardRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchupCardRowComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchupCardRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
