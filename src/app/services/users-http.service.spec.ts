import { TestBed } from '@angular/core/testing';

import { UsersHttpService } from './users-http.service';

describe('UsersHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersHttpService = TestBed.get(UsersHttpService);
    expect(service).toBeTruthy();
  });
});
