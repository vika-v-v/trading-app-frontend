import { TestBed } from '@angular/core/testing';

import { MockUserService } from './user.mock.service';

describe('UserService', () => {
  let service: MockUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
