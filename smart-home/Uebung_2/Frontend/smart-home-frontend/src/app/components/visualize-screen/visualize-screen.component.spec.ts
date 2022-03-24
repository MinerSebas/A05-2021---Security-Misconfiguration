import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizeScreenComponent } from './visualize-screen.component';

describe('VisualizeScreenComponent', () => {
  let component: VisualizeScreenComponent;
  let fixture: ComponentFixture<VisualizeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizeScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
