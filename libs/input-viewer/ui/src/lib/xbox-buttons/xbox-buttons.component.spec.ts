import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XboxButtonsComponent } from './xbox-buttons.component';

describe('XboxButtonsComponent', () => {
  let component: XboxButtonsComponent;
  let fixture: ComponentFixture<XboxButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XboxButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XboxButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
