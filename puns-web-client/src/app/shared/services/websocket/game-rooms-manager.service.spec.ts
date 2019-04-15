import { TestBed, inject } from '@angular/core/testing';

import { GameRoomsManagerService } from './game-rooms-manager.service';

describe('GameRoomsManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRoomsManagerService]
    });
  });

  it('should be created', inject([GameRoomsManagerService], (service: GameRoomsManagerService) => {
    expect(service).toBeTruthy();
  }));
});
