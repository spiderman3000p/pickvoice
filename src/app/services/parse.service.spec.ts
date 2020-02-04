import { TestBed } from '@angular/core/testing';

import { ParseService } from './parse.service';

describe('ParseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParseService = TestBed.get(ParseService);
    expect(service).toBeTruthy();
  });
});
