import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserUsernameDialogComponent } from './change-user-username-dialog.component';

describe('ChangeUserUsernameDialogComponent', () => {
  let component: ChangeUserUsernameDialogComponent;
  let fixture: ComponentFixture<ChangeUserUsernameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeUserUsernameDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeUserUsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
