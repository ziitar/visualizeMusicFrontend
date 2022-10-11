import { TestBed } from '@angular/core/testing';

import { HttpInjectable } from './http-injectable.service';

describe('HttpInjectableService', () => {
  let service: HttpInjectable;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInjectable);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
