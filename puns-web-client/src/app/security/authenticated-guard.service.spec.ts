import { TestBed, inject } from '@angular/core/testing';

import { AuthenticatedGuardService } from './authenticated-guard.service';

describe('AuthenticatedGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticatedGuardService]
    });
  });

  it('should be created', inject([AuthenticatedGuardService], (service: AuthenticatedGuardService) => {
    expect(service).toBeTruthy();
  }));
});
