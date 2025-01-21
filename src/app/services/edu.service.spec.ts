import { TestBed } from '@angular/core/testing';

import { EduService } from './edu.service';

describe('EduService', () => {
  let service: EduService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EduService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
