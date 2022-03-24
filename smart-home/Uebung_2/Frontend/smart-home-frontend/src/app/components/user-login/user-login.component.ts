import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersList } from 'src/app/models/users.model';
import bckConfig from '../../configuration/backend-config.json';
import { forbiddenUserPassword } from 'src/app/shared/validators/user-password.validator';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  private userRegisterNavigation: string[] = ['/user_register'];

  private visualizeScreenNavigation: string[] = ['/visualize'];

  constructor(private alertDialog: MatDialog, private router: Router, private httpClient: HttpClient) {
    this.user = {} as User;
    this.loggedInUser = {} as User;
    this.loggedInUsers = {} as UsersList;
    this.error = '';
    this.errorOccurred = false;
  }

  public usersLogin = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    passWord: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenUserPassword])
  });

  public user: User;

  public loggedInUser: User;

  public loggedInUsers: UsersList;

  public error: string;

  public errorOccurred: boolean;

  ngOnInit(): void {
    console.log('init');
  }

  get userName() {
    return this.usersLogin.get('userName');
  }

  get passWord() {
    return this.usersLogin.get('passWord');
  }

  public handleCreateAccountButtonClick(): void {
    this.router.navigate(this.userRegisterNavigation);
  }

  public handleSubmitButtonClick(): void {
    this.requestUserAccounts();
  }

  public requestUserAccount(): void {
    this.httpClient.get<User>(`http://${bckConfig.server}:${bckConfig.port}/user/lookup?userName=${this.user.userName}&passWord=${this.user.passWord}`).subscribe({
      next: this.onNextAccount,
      error: (error) => console.error(error),
      complete: () => console.info('admin account lookup')
    });
  }

  public requestUserAccounts(): void {
    this.httpClient.get<Array<User>>(`http://${bckConfig.server}:${bckConfig.port}/user/lookup?userName=${this.user.userName}&passWord=${this.user.passWord}`).subscribe({
      next: this.onNextAccounts,
      error: this.handleHttpErrorResponse.bind(this),
      complete: () => this.requestedUserAccountsCallback()
    });
  }

  private requestedUserAccountsCallback(): void {
    if (this.errorOccurred) {
      this.errorOccurred = false;
    }

    if (!this.errorOccurred) {
      this.loggedInUser = this.loggedInUsers.result[0];
      this.router.navigate(this.visualizeScreenNavigation, 
        { 
          state: {
          data: {
            metaUser: this.loggedInUser,
            indicator : "User"
          }
        } 
      });
    }
  }

  private onNextAccount = (response: User): void => {
    this.loggedInUser = response;
  };

  private onNextAccounts = (response: Array<User>): void => {
    this.loggedInUsers.result = response;
  };

  private handleHttpErrorResponse(response: HttpErrorResponse): void {
    this.errorOccurred = true;
    this.error = response.error.error;

    if (this.error == null || this.error == undefined) {
      this.error = 'Some error occurred during the log-in. Try again later!';
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
}
