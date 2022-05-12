import { TestBed } from '@angular/core/testing';

import { ElectronGuard } from './electron.guard';

describe('ElectronGuard', () => {
  let guard: ElectronGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ElectronGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
