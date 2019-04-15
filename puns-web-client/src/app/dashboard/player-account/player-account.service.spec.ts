import { TestBed, inject } from '@angular/core/testing';

import { PlayerAccountService } from './player-account.service';

describe('PlayerAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayerAccountService]
    });
  });

  it('should be created', inject([PlayerAccountService], (service: PlayerAccountService) => {
    expect(service).toBeTruthy();
  }));
});
