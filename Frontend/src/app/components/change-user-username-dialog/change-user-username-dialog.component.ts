import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeUserUsernameData } from 'src/app/models/change-user-username-data.model';

@Component({
  selector: 'app-change-user-username-dialog',
  templateUrl: './change-user-username-dialog.component.html',
  styleUrls: ['./change-user-username-dialog.component.scss']
})
export class ChangeUserUsernameDialogComponent implements OnInit {
   constructor(
    public dialogRef: MatDialogRef<ChangeUserUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      newUsername: string;
      oldUsername: string;
    }
  ) {
    this.userNameToChangeData = {} as ChangeUserUsernameData;
  }

  public userNameToChangeData: ChangeUserUsernameData;

  public changeUsernameForm = new FormGroup({
    oldUsername: new FormControl('', [Validators.required, Validators.minLength(3)]),
    newUsername: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  ngOnInit(): void {
    console.log('init');
  }

  get oldUsername() {
    return this.changeUsernameForm.get('oldUsername');
  }

  get newUsername() {
    return this.changeUsernameForm.get('newUsername');
  }

  public handleCancelButtonClick(): void {
    this.dialogRef.close();
  }

  public handleOkButtonClick(): void {
    if (this.oldUsername?.errors) {
      return;
    }

    if (this.newUsername?.errors) {
      return;
    }

    this.data.newUsername = this.userNameToChangeData.newUsername;
    this.data.oldUsername = this.userNameToChangeData.oldUsername;
    this.dialogRef.close(this.data);
  }
}
