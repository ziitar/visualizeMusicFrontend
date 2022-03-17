import { TestBed } from '@angular/core/testing';

import { HttpInjectableService } from './http-injectable.service';

describe('HttpInjectableService', () => {
  let service: HttpInjectableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInjectableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
