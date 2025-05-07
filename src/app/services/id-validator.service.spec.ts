import { TestBed } from '@angular/core/testing';

import { IdValidatorService } from './id-validator.service';

describe('IdValidatorService', () => {
  let service: IdValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
