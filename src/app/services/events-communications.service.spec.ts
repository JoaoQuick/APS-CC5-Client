import { TestBed } from '@angular/core/testing';

import { EventsCommunicationsService } from './events-communications.service';

describe('EventsCommunicationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventsCommunicationsService = TestBed.get(EventsCommunicationsService);
    expect(service).toBeTruthy();
  });
});
