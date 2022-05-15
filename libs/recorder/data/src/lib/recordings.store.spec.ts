import { TestBed } from '@angular/core/testing';

import { RecordingsStore } from './recordings.store';

describe('RecordingsStore', () => {
  let service: RecordingsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordingsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
