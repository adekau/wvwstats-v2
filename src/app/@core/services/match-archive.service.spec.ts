import { TestBed } from '@angular/core/testing';

import { MatchArchiveService } from './match-archive.service';

describe('MatchArchiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MatchArchiveService = TestBed.get(MatchArchiveService);
    expect(service).toBeTruthy();
  });
});
