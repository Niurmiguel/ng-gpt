import { TestBed } from '@angular/core/testing';

import { NgGptService } from './ng-gpt.service';

describe('NgGptService', () => {
  let service: NgGptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgGptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
