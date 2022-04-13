import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import bckConfig from '../../configuration/backend-config.json';
import { Router } from '@angular/router';
import { ChangeSensorData } from 'src/app/models/change-sensor-data.model';
import { Sensor } from 'src/app/models/sensor.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-change-sensor-screen',
  templateUrl: './change-sensor-screen.component.html',
  styleUrls: ['./change-sensor-screen.component.scss'],
})
export class ChangeSensorScreenComponent implements OnInit {
  private updateSensorErrorOccurred = false;

  private updateSensorError = '';

  private changeSensorScreenData: ChangeSensorData;

  private homeNavigation: string[] = ['/'];

  private visualizeNavigation: string[] = ['/visualize'];

  private notFoundNavigation: string[] = ['notfound'];

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.changeSensorScreenData = history.state;
    this.currentUserName = this.changeSensorScreenData.user.userName;
    this.value = 0;
  }

  public currentUserName: string;

  public value: number;

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.router.navigate(this.visualizeNavigation, {
      state: this.changeSensorScreenData.user,
    });
  }

  ngOnInit(): void {
    if (this.changeSensorScreenData.user.personId == undefined) {
      this.router.navigate(this.notFoundNavigation);
      return;
    }
  }

  public updateSensorValue(): void {
    this.httpClient
      .put<Sensor>(
        `http://${bckConfig.server}:${bckConfig.port}/sensors/${this.changeSensorScreenData.sensor.id}`,
        {
          id: this.changeSensorScreenData.sensor.id,
          ownerId: this.changeSensorScreenData.user.personId,
          value: this.value,
        }
      )
      .subscribe({
        next: this.onUpdatedSensor,
        error: this.handleUpdateSensorHttpErrorResponse.bind(this),
        complete: () => this.requestedSensorUpdateCallback(),
      });
  }

  public handleLogOutButtonClick() {
    this.changeSensorScreenData = {} as ChangeSensorData;
    this.router.navigate(this.homeNavigation);
  }

  public handleBackToVisualizeButtonClick() {
    this.router.navigate(this.visualizeNavigation, {
      state: {
        data : {
          metaUser: this.changeSensorScreenData.user,
          indicator : this.changeSensorScreenData.role
        }
      }
    });
  }

  public change(): void {
    this.updateSensorValue();
  }

  private onUpdatedSensor = (response: Sensor): void => {
    this.changeSensorScreenData.sensor.id = response.id;
    this.changeSensorScreenData.sensor.ownerId = response.ownerId;
    this.changeSensorScreenData.sensor.value = response.value;
  };

  private handleUpdateSensorHttpErrorResponse(
    response: HttpErrorResponse
  ): void {
    this.updateSensorErrorOccurred = true;
    this.updateSensorError = response.error.error;

    if (this.updateSensorError == null || this.updateSensorError == undefined) {
      this.updateSensorError =
        'Some error occurred during the updating of the sensor. Try again later!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.updateSensorError,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateSensorError = '';
    });
  }

  private requestedSensorUpdateCallback(): void {
    if (this.updateSensorErrorOccurred) {
      this.updateSensorErrorOccurred = false;
    }
    this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: 'The sensor was successfully updated!',
      },
    });
  }
}
