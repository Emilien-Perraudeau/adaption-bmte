import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationModeComponent } from './modification-mode.component';

describe('ModificationModeComponent', () => {
  let component: ModificationModeComponent;
  let fixture: ComponentFixture<ModificationModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
