import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {
  private adminRegisterNavigation: string[] = ['/admin_register'];

  private userRegisterNavigation: string[] = ['/user_register'];

  constructor(private router: Router) {
    this.changeDate();
  }

  public currentDate = new Date();

  public handleEnterAsAdminButtonClick(): void {
    this.router.navigate(this.adminRegisterNavigation);
  }

  public handleEnterAsUserButtonClick(): void {
    this.router.navigate(this.userRegisterNavigation);
  }

  private changeDate(): void {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }
}
