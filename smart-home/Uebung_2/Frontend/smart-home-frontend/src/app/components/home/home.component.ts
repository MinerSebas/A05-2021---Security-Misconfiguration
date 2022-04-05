import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  private adminLoginNavigation: string[] = ['/admin_login'];

  private userLoginNavigation: string[] = ['/user_login'];

  constructor(private router: Router) {
    this.changeDate();
  }

  public currentDate = new Date();

  public handleEnterAsAdminButtonClick(): void {
    this.router.navigate(this.adminLoginNavigation);
  }

  public handleEnterAsUserButtonClick(): void {
    this.router.navigate(this.userLoginNavigation);
  }

  private changeDate(): void {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }
}
