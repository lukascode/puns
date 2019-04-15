import { TestBed, inject } from '@angular/core/testing';

import { MediaDownloadProxyService } from './media-download-proxy.service';

describe('MediaDownloadProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaDownloadProxyService]
    });
  });

  it('should be created', inject([MediaDownloadProxyService], (service: MediaDownloadProxyService) => {
    expect(service).toBeTruthy();
  }));
});
