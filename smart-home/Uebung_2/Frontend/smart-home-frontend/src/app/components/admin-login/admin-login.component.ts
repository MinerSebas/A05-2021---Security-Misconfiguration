import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import bckConfig from '../../configuration/backend-config.json';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin.model';
import { AdminsList } from 'src/app/models/admins.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenAdminPassword } from 'src/app/shared/validators/admin-password.validator';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})

export class AdminLoginComponent implements OnInit {
  private adminRegisterNavigation: string[] = ['/admin_register'];

  private visualizeNavigation: string[] = ['/visualize'];

  constructor(private alertDialog: MatDialog, private router: Router, private httpClient: HttpClient) {
    this.admin = {} as Admin;
    this.loggedInAdmin = {} as Admin;
    this.loggedInAdmins = {} as AdminsList;
    this.error = '';
    this.errorOccurred = false;
  }

  public adminLoginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    passWord: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenAdminPassword])
  });

  public admin: Admin;

  public loggedInAdmin: Admin;

  public loggedInAdmins: AdminsList;

  public error: string;

  public errorOccurred: boolean;

  ngOnInit(): void {
    console.log('init');
  }

  get userName() {
    return this.adminLoginForm.get('userName');
  }

  get passWord() {
    return this.adminLoginForm.get('passWord');
  }

  public handleCreateAccountButtonClick(): void {
    this.router.navigate(this.adminRegisterNavigation);
  }

  public handleSubmitButtonClick(): void {
    this.requestAdminAccounts();
  }

  public requestAdminAccount(): void {
    this.httpClient.get<Admin>(`http://${bckConfig.server}:${bckConfig.port}/admin/lookup?userName=${this.admin.userName}&passWord=${this.admin.passWord}`).subscribe({
      next: this.onNextAccount,
      error: (error) => console.error(error),
      complete: () => console.info('admin account lookup')
    });
  }

  public requestAdminAccounts(): void {
    this.httpClient.get<Array<Admin>>(`http://${bckConfig.server}:${bckConfig.port}/admin/lookup?userName=${this.admin.userName}&passWord=${this.admin.passWord}`).subscribe({
      next: this.onNextAccounts,
      error: this.handleHttpErrorResponse.bind(this),
      complete: () => this.requestedAdminAccountsCallback()
    });
  }

  private requestedAdminAccountsCallback(): void {
    if (this.errorOccurred) {
      this.errorOccurred = false;
    }

    if (!this.errorOccurred) {
      this.loggedInAdmin = this.loggedInAdmins.result[0];
      this.router.navigate(this.visualizeNavigation, 
        { 
          state: {
          data: {
            metaUser : this.loggedInAdmin,
            indicator : "Admin"
          }
      }
    });
    }
  }

  private onNextAccount = (response: Admin): void => {
    this.loggedInAdmin = response;
  };

  private onNextAccounts = (response: Array<Admin>): void => {
    this.loggedInAdmins.result = response;
    console.log(response[0].userName);
    console.log(response[0].passWord);
    console.log(response[0].personId);
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
