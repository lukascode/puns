import { TestBed, inject } from '@angular/core/testing';

import { NotAuthenticatedGuardService } from './not-authenticated-guard.service';

describe('NotAuthenticatedGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotAuthenticatedGuardService]
    });
  });

  it('should be created', inject([NotAuthenticatedGuardService], (service: NotAuthenticatedGuardService) => {
    expect(service).toBeTruthy();
  }));
});
