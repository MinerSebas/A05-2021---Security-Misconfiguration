import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeActorScreenComponent } from './change-actor-screen.component';

describe('ChangeActorScreenComponent', () => {
  let component: ChangeActorScreenComponent;
  let fixture: ComponentFixture<ChangeActorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeActorScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeActorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
