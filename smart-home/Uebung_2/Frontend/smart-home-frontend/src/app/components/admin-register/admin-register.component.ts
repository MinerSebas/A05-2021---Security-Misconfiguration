import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import bckConfig from '../../configuration/backend-config.json';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forbiddenAdminPassword } from 'src/app/shared/validators/admin-password.validator';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss']
})
/**
 * The admin register component.
 */
export class AdminRegisterComponent implements OnInit {
  private adminLoginNavigation: string[] = ['/admin_login'];

  constructor(private alertDialog: MatDialog, private router: Router, private httpClient: HttpClient) {
    this.admin = {} as Admin;
    this.registeredAdmin = {} as Admin;
    this.error = '';
    this.errorOccurred = false;
  }

  public adminRegisterForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    passWord: new FormControl('', [Validators.required, Validators.minLength(8), forbiddenAdminPassword])
  });

  public admin: Admin;

  public registeredAdmin: Admin;

  public error: string;

  public errorOccurred: boolean;

  ngOnInit(): void {
    console.log('init');
  }

  get userName() {
    return this.adminRegisterForm.get('userName');
  }

  get passWord() {
    return this.adminRegisterForm.get('passWord');
  }

  public handleLoginButtonClick(): void {
    this.router.navigate(this.adminLoginNavigation);
  }

  public handleSubmitButtonClick(): void {
    this.createNewAccount();
  }

  public createNewAccount(): void {
    console.log('hello');
    var adminPost = {
      userName: this.admin.userName,
      passWord: this.admin.passWord
    } as Admin;
    this.httpClient.post<Admin>(`http://${bckConfig.server}:${bckConfig.port}/admin/newaccount`, adminPost).subscribe({
      next: this.onRegisteredAccount,
      error: this.handleHttpErrorResponse.bind(this),
      complete: () => this.requestAdminRegistrationCallback()
    });
  }

  private onRegisteredAccount = (response: Admin): void => {
    this.registeredAdmin.personId = response.personId;
    this.registeredAdmin.userName = response.userName;
    this.registeredAdmin.passWord = response.passWord;
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

  private requestAdminRegistrationCallback(): void {
    if (this.errorOccurred) {
      this.errorOccurred = false;
    }

    if (this.admin.passWord == this.registeredAdmin.passWord && this.admin.userName == this.registeredAdmin.userName) {
      this.alertDialog.open(AlertDialogComponent, {
        data: {
          alertMessage: 'The account was successfully created!'
        }
      });
    }
  }
}
