import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSensorScreenComponent } from './change-sensor-screen.component';

describe('ChangeSensorScreenComponent', () => {
  let component: ChangeSensorScreenComponent;
  let fixture: ComponentFixture<ChangeSensorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSensorScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSensorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
