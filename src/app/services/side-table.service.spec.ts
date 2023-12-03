import { TestBed } from '@angular/core/testing';

import { SideTableService } from './side-table.service';

describe('SideTableService', () => {
  let service: SideTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
