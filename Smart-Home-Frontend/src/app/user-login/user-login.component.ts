import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  providers: [UserService, CookieService],
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent{

  constructor(
  private userService: UserService,
  private cookieService: CookieService,
  ) { }
  

  onLogin(email: string, password: string): void {
    this.userService.loginUser(email, password).subscribe(
      (response: boolean) => {
        if (response === true) {
          this.cookieService.set('email', email);
          this.cookieService.set('password', password);

          window.location.href = '/data';
        }
      }
    );
  }
}
