import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { ChangeActorScreenComponent } from './components/change-actor-screen/change-actor-screen.component';
import { ChangeSensorScreenComponent } from './components/change-sensor-screen/change-sensor-screen.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { VisualizeScreenComponent } from './components/visualize-screen/visualize-screen.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  { path: 'admin_register', component: AdminRegisterComponent },
  { path: 'user_register', component: UserRegisterComponent },
  { path: 'user_login', component: UserLoginComponent },
  { path: 'notfound', component: NotFoundComponent },
  { path: 'edit', component: EditUserProfileComponent },
  { path: 'visualize', component: VisualizeScreenComponent},
  { path: 'change-sensor', component: ChangeSensorScreenComponent},
  { path: 'change-actor', component: ChangeActorScreenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
