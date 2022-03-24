import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangeAdminUsernameData } from 'src/app/models/change-admin-username-data.model';
import bckConfig from '../../configuration/backend-config.json';
import { ChangeUserPasswordData } from 'src/app/models/change-user-password-data.model';
import { ChangeUserUsernameData } from 'src/app/models/change-user-username-data.model';
import { User } from 'src/app/models/user.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ChangeUserPasswordDialogComponent } from '../change-user-password-dialog/change-user-password-dialog.component';
import { ChangeUserUsernameDialogComponent } from '../change-user-username-dialog/change-user-username-dialog.component';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {
  private loggedInUser: User;

  private homeNavigation: string[] = ['/'];

  private visualizeNavigation: string[] = ['/visualize'];

  private notFoundNavigation: string[] = ['notfound'];

  private changePasswordData: ChangeUserPasswordData;

  private changeUsernameData: ChangeUserUsernameData;

  private updatePasswordError: string;

  private updatePasswordErrorOccurred: boolean;

  private updateUsernameError: string;

  private updateUsernameErrorOccurred: boolean;

  constructor(private router: Router, private httpClient: HttpClient, private dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.loggedInUser = history.state;
    this.currentUserName = '';
    this.changePasswordData = {} as ChangeUserPasswordData;
    this.changeUsernameData = {} as ChangeUserUsernameData;
    this.updatePasswordError = '';
    this.updatePasswordErrorOccurred = false;
    this.updateUsernameError = '';
    this.updateUsernameErrorOccurred = false;
  }

  public currentUserName: string;

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.router.navigate(this.visualizeNavigation, { state: this.loggedInUser });
  }

  ngOnInit(): void {
    if (this.loggedInUser.personId == undefined) {
      this.router.navigate(this.notFoundNavigation);
      return;
    }

    this.currentUserName = this.loggedInUser.userName;
    this.changeUsernameData.oldUsername = this.loggedInUser.userName;
    this.changePasswordData.oldPassword = this.loggedInUser.passWord;
    this.changeUsernameData.userId = this.loggedInUser.personId;
    this.changePasswordData.userId = this.loggedInUser.personId;
  }

  public handleBackToVisualizeButtonClick(): void {
    this.router.navigate(this.visualizeNavigation, {
       state: {
         data: {
           metaUser : this.loggedInUser,
           indicator : "User"
         }
      }
      });
  }

  public handleLogOutButtonClick(): void {
    this.loggedInUser = {} as User;
    this.router.navigate(this.homeNavigation);
  }

  public handleChangePasswordButtonClick(): void {
    const dialogRef = this.dialog.open(ChangeUserPasswordDialogComponent, {
      disableClose: true,
      data: {
        oldPassword: this.changePasswordData.oldPassword
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) {
        return;
      }

      console.log(result);
      this.changePasswordData.oldPassword = result.oldPassword;
      this.changePasswordData.newPassword = result.newPassword;
      this.updatePassword();
    });
  }

  public updatePassword(): void {
    this.httpClient
      .put<ChangeUserPasswordData>(`http://${bckConfig.server}:${bckConfig.port}/user-edit/password/${this.loggedInUser.personId}`, {
        userId: this.loggedInUser.personId,
        oldPassword: this.changePasswordData.oldPassword,
        newPassword: this.changePasswordData.newPassword
      })
      .subscribe({
        next: this.onUpdatedPassword,
        error: this.handleUpdatePasswordHttpErrorResponse.bind(this),
        complete: () => this.requestedPasswordUpdateCallback()
      });
  }

  public updateUsername(): void {
    this.httpClient
      .put<ChangeUserUsernameData>(`http://${bckConfig.server}:${bckConfig.port}/user-edit/username/${this.loggedInUser.personId}`, {
        userId: this.loggedInUser.personId,
        oldUsername: this.changeUsernameData.oldUsername,
        newUsername: this.changeUsernameData.newUsername
      })
      .subscribe({
        next: this.onUpdatedUsername,
        error: this.handleUpdateUsernameHttpErrorResponse.bind(this),
        complete: () => this.requestedUsernameUpdateCallback()
      });
  }

  public handleChangeUsernameButtonClick(): void {
    const dialogRef = this.dialog.open(ChangeUserUsernameDialogComponent, {
      disableClose: true,
      data: {
        oldUsername: this.changeUsernameData.oldUsername
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) {
        return;
      }

      console.log(result);
      this.changeUsernameData.oldUsername = result.oldUsername;
      this.changeUsernameData.newUsername = result.newUsername;
      this.updateUsername();
    });
  }

  private handleUpdatePasswordHttpErrorResponse(response: HttpErrorResponse): void {
    this.updatePasswordErrorOccurred = true;
    this.updatePasswordError = response.error.error;

    if (this.updatePasswordError == null || this.updatePasswordError == undefined) {
      this.updatePasswordError = 'Some error occurred during the updating of the password. Try again later!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.updatePasswordError
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updatePasswordError = '';
    });
  }

  private handleUpdateUsernameHttpErrorResponse(response: HttpErrorResponse): void {
    this.updateUsernameErrorOccurred = true;
    this.updateUsernameError = response.error.error;

    if (this.updateUsernameError == null || this.updateUsernameError == undefined) {
      this.updateUsernameError = 'Some error occurred during the updating of the username. Try again later!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.updateUsernameError
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateUsernameError = '';
    });
  }

  private onUpdatedPassword = (response: ChangeUserPasswordData): void => {
    this.changePasswordData.oldPassword = this.loggedInUser.passWord;
    this.loggedInUser.passWord = response.newPassword;
    this.changePasswordData.newPassword = this.loggedInUser.passWord;
  };

  private onUpdatedUsername = (response: ChangeUserUsernameData): void => {
    this.changeUsernameData.oldUsername = this.loggedInUser.userName;
    this.loggedInUser.userName = response.newUsername;
    this.changeUsernameData.newUsername = this.loggedInUser.userName;
  };

  private requestedPasswordUpdateCallback(): void {
    if (this.updatePasswordErrorOccurred) {
      this.updatePasswordErrorOccurred = false;
    }
    this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: 'The password was successfully updated!'
      }
    });
  }

  private requestedUsernameUpdateCallback(): void {
    if (this.updateUsernameErrorOccurred) {
      this.updateUsernameErrorOccurred = false;
    }
    this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: 'The username was successfully updated!'
      }
    });
    this.currentUserName = this.changeUsernameData.newUsername;
  }
}
