import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPopoverComponent } from './server-popover.component';

describe('ServerPopoverComponent', () => {
  let component: ServerPopoverComponent;
  let fixture: ComponentFixture<ServerPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
