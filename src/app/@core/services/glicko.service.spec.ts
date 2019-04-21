import { TestBed } from '@angular/core/testing';

import { GlickoService } from './glicko.service';

describe('GlickoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlickoService = TestBed.get(GlickoService);
    expect(service).toBeTruthy();
  });
});
