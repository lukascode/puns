import { TestBed, inject } from '@angular/core/testing';

import { NodeApiService } from './node-api.service';

describe('NodeApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeApiService]
    });
  });

  it('should be created', inject([NodeApiService], (service: NodeApiService) => {
    expect(service).toBeTruthy();
  }));
});
