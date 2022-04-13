import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import bckConfig from '../../configuration/backend-config.json';
import { forbiddenUserPassword } from 'src/app/shared/validators/user-password.validator';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.scss']
})
export class UserRegisterComponent implements OnInit {
  private adminLoginNavigation: string[] = ['/user_login'];

  constructor(private alertDialog: MatDialog, private router: Router, private httpClient: HttpClient) {
    this.user = {} as User;
    this.registeredUser = {} as User;
    this.error = '';
    this.errorOccurred = false;
  }

  public userRegisterForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    passWord: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenUserPassword])
  });

  public user: User;

  public registeredUser: User;

  public error: string;

  public errorOccurred: boolean;

  ngOnInit(): void {
    console.log('init');
  }

  get userName() {
    return this.userRegisterForm.get('userName');
  }

  get passWord() {
    return this.userRegisterForm.get('passWord');
  }

  public handleLoginButtonClick(): void {
    this.router.navigate(this.adminLoginNavigation);
  }

  public handleSubmitButtonClick(): void {
    this.createNewAccount();
  }

  public createNewAccount(): void {
    console.log('hello');
    var userPost = {
      userName: this.user.userName,
      passWord: this.user.passWord
    } as User;
    this.httpClient.post<User>(`http://${bckConfig.server}:${bckConfig.port}/user/newaccount`, userPost).subscribe({
      next: this.onRegisteredAccount,
      error: this.handleHttpErrorResponse.bind(this),
      complete: () => this.requestUserRegistrationCallback()
    });
  }

  private onRegisteredAccount = (response: User): void => {
    this.registeredUser.personId = response.personId;
    this.registeredUser.userName = response.userName;
    this.registeredUser.passWord = response.passWord;
  };

  private handleHttpErrorResponse(response: HttpErrorResponse): void {
    this.errorOccurred = true;
    this.error = response.error.error;

    if (this.error == null || this.error == undefined) {
      this.error = 'Some error occurred during the registration. Try again later!';
    }

    const dialogRef = this.alertDialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.error
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.error = '';
    });
  }

  private requestUserRegistrationCallback(): void {
    if (this.errorOccurred) {
      this.errorOccurred = false;
    }

    if (this.user.passWord == this.registeredUser.passWord && this.user.userName == this.registeredUser.userName) {
      this.alertDialog.open(AlertDialogComponent, {
        data: {
          alertMessage: 'The account was successfully created!'
        }
      });
    }
  }
}
