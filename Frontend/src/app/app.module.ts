import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QrCodeModule } from 'ng-qrcode';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { MatCardModule } from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { KeysPipe } from './shared/pipes/keys.pipe';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { VisualizeScreenComponent } from './components/visualize-screen/visualize-screen.component';
import { EditUserProfileComponent } from './components/edit-user-profile/edit-user-profile.component';
import { ChangeUserUsernameDialogComponent } from './components/change-user-username-dialog/change-user-username-dialog.component';
import { ChangeUserPasswordDialogComponent } from './components/change-user-password-dialog/change-user-password-dialog.component';
import { ChangeSensorScreenComponent } from './components/change-sensor-screen/change-sensor-screen.component';
import { ChangeActorScreenComponent } from './components/change-actor-screen/change-actor-screen.component';

@NgModule({
  declarations: [
    KeysPipe,
    AppComponent,
    HomeComponent,
    AdminLoginComponent,
    AdminRegisterComponent,
    AlertDialogComponent,
    NotFoundComponent,
    UserLoginComponent,
    UserRegisterComponent,
    VisualizeScreenComponent,
    EditUserProfileComponent,
    ChangeUserUsernameDialogComponent,
    ChangeUserPasswordDialogComponent,
    ChangeSensorScreenComponent,
    ChangeActorScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,
    MatBadgeModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    QrCodeModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatTabsModule,
    MatTableModule,
    MatMenuModule,
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
