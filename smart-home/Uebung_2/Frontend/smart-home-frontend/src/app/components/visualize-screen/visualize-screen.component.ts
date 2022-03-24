import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import bckConfig from '../../configuration/backend-config.json';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import { MetaUser } from 'src/app/models/meta-user.model';
import { Sensor } from 'src/app/models/sensor.model';
import { User } from 'src/app/models/user.model';
import { DetermineSpecificUserVisitor } from 'src/app/models/visitors/determine-specific-user.visitor.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ChangeSensorData } from 'src/app/models/change-sensor-data.model';
import { ChangeActorData } from 'src/app/models/change-actor-data.model';
import { Admin } from 'src/app/models/admin.model';

@Component({
  selector: 'app-visualize-screen',
  templateUrl: './visualize-screen.component.html',
  styleUrls: ['./visualize-screen.component.scss'],
})
export class VisualizeScreenComponent implements OnInit {
  private changeSensorNavigation: string[] = ['/change-sensor'];

  private changeActorNavigation: string[] = ['/change-actor'];

  private changeProfileNavigation: string[] = ['/edit'];

  private notFoundNavigation: string[] = ['notfound'];

  private homeNavigation: string[] = ['/'];

  private userVisitor = new DetermineSpecificUserVisitor();

  private getSensorsError = '';

  private getSensorsErrorOccurred = false;

  private getActorsError = '';

  private getActorsErrorOccurred = false;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.metaUser = {} as MetaUser;
    this.dbSensors = new Array<Sensor>();
    this.currentSensors = new Array<Sensor>();
    this.dbActors = new Array<Actor>();
    this.currentActors = new Array<Actor>();
  }

  public dbSensors: Array<Sensor>;

  public currentSensors: Array<Sensor>;

  public dbActors: Array<Actor>;

  public currentActors: Array<Actor>;

  public metaUser: MetaUser;

  ngOnInit(): void {
    this.setMetaUser();
    if (this.metaUser.personId == undefined) {
      this.router.navigate(this.notFoundNavigation);
      return;
    }

    this.requestSensors();
    this.requestActors();
  }

  public determineSpecificUser(): String {
    this.metaUser.acceptVisitor(this.userVisitor);
    return this.userVisitor.identifier;
  }

  public requestSensors(): void {
    this.httpClient
      .get<Array<Sensor>>(
        `http://${bckConfig.server}:${bckConfig.port}/sensors/lookup?ownerId=${this.metaUser.personId}`
      )
      .subscribe({
        next: this.onNextSensors,
        error: this.handleSensorsHttpErrorResponse.bind(this),
        complete: () => this.requestedSensorsCallback(),
      });
  }

  public handleModifySensorButtonClick(sensor: Sensor): void {
    if (this.determineSpecificUser() == 'Admin') {
      var data = {
        sensor: sensor,
        user: this.metaUser,
        role: "Admin"
      } as ChangeSensorData;
      this.router.navigate(this.changeSensorNavigation, { state: data });
    }
  }

  public handleModifyActorButtonClick(actor: Actor): void {
    if (this.determineSpecificUser() == 'Admin') {
      var data = {
        actor: actor,
        user: this.metaUser,
        role : "Admin"
      } as ChangeActorData;
      this.router.navigate(this.changeActorNavigation, { state: data });
    }
  }

  public handleLogOutButtonClick(): void {
    this.metaUser = {} as MetaUser;
    this.dbActors = new Array<Actor>();
    this.dbSensors = new Array<Sensor>();
    this.currentActors = new Array<Actor>();
    this.currentSensors = new Array<Sensor>();
    this.router.navigate(this.homeNavigation);
  }

  public handleModifyProfileButtonClick(): void {
    if (this.determineSpecificUser() == 'User') {
      var user = new User();
      user.personId = this.metaUser.personId;
      user.passWord = this.metaUser.passWord;
      user.userName = this.metaUser.userName;
      this.router.navigate(this.changeProfileNavigation, { state: user });
    }
  }

  private onNextSensors = (response: Array<Sensor>): void => {
    this.dbSensors = response;
  };

  private handleSensorsHttpErrorResponse(response: HttpErrorResponse): void {
    this.getSensorsErrorOccurred = true;
    this.getSensorsError = response.error.error;

    if (this.getSensorsError == null || this.getSensorsError == undefined) {
      this.getSensorsError =
        'Some error occurred during the fetch of your sensors!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.getSensorsError,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getSensorsError = '';
    });
  }

  private requestedSensorsCallback(): void {
    if (this.getSensorsErrorOccurred) {
      this.getSensorsErrorOccurred = false;
    }

    if (this.dbSensors.length != 0) {
      for (var entry of this.dbSensors) {
        this.currentSensors.push(entry);
      }
    }
  }

  public requestActors(): void {
    this.httpClient
      .get<Array<Actor>>(
        `http://${bckConfig.server}:${bckConfig.port}/actors/lookup?ownerId=${this.metaUser.personId}`
      )
      .subscribe({
        next: this.onNextActors,
        error: this.handleActorsHttpErrorResponse.bind(this),
        complete: () => this.requestedActorsCallback(),
      });
  }

  private onNextActors = (response: Array<Actor>): void => {
    this.dbActors = response;
  };

  private handleActorsHttpErrorResponse(response: HttpErrorResponse): void {
    this.getActorsErrorOccurred = true;
    this.getActorsError = response.error.error;

    if (this.getActorsError == null || this.getActorsError == undefined) {
      this.getActorsError =
        'Some error occurred during the fetch of your actors!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.getActorsError,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getActorsError = '';
    });
  }

  private requestedActorsCallback(): void {
    if (this.getActorsErrorOccurred) {
      this.getActorsErrorOccurred = false;
    }

    if (this.dbActors.length != 0) {
      for (var entry of this.dbActors) {
        this.currentActors.push(entry);
      }
    }
  }

  private setMetaUser(): void {
    var indicator = history.state.data.indicator;
    var userObj = history.state.data.metaUser;

    if (indicator == 'User') {
      this.metaUser = new User();
      this.metaUser.userName = userObj.userName;
      this.metaUser.passWord = userObj.passWord;
      this.metaUser.personId = userObj.personId;
    }

    if (indicator == 'Admin') {
      this.metaUser = new Admin();
      this.metaUser.userName = userObj.userName;
      this.metaUser.passWord = userObj.passWord;
      this.metaUser.personId = userObj.personId;
    }
  }
}
