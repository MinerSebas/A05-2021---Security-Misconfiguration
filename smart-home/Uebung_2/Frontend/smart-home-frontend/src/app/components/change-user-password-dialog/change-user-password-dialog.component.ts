import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeUserPasswordData } from 'src/app/models/change-user-password-data.model';
import { forbiddenUserPassword } from 'src/app/shared/validators/user-password.validator';

@Component({
  selector: 'app-change-user-password-dialog',
  templateUrl: './change-user-password-dialog.component.html',
  styleUrls: ['./change-user-password-dialog.component.scss']
})
export class ChangeUserPasswordDialogComponent implements OnInit {

   constructor(
    public dialogRef: MatDialogRef<ChangeUserPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      newPassword: string;
      oldPassword: string;
    }
  ) {
    this.passWordToChangeData = {} as ChangeUserPasswordData;
  }

  public passWordToChangeData: ChangeUserPasswordData;

  public changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenUserPassword]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenUserPassword])
  });

  ngOnInit(): void {
    console.log('init');
  }

  get oldPassword() {
    return this.changePasswordForm.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  public handleCancelButtonClick(): void {
    this.dialogRef.close();
  }

  public handleOkButtonClick(): void {
    if (this.newPassword?.errors) {
      return;
    }

    if (this.oldPassword?.errors) {
      return;
    }

    this.data.oldPassword = this.passWordToChangeData.oldPassword;
    this.data.newPassword = this.passWordToChangeData.newPassword;
    this.dialogRef.close(this.data);
  }
}
