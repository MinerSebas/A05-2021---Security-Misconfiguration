import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Actor } from 'src/app/models/actor.model';
import bckConfig from '../../configuration/backend-config.json';
import { ChangeActorData } from 'src/app/models/change-actor-data.model';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-change-actor-screen',
  templateUrl: './change-actor-screen.component.html',
  styleUrls: ['./change-actor-screen.component.scss']
})
export class ChangeActorScreenComponent implements OnInit {
  private updateActorErrorOccurred = false;

  private updateActorError = '';

  private changeActorScreenData : ChangeActorData;

  private homeNavigation: string[] = ['/'];

  private visualizeNavigation: string[] = ['/visualize'];

  private notFoundNavigation: string[] = ['notfound'];

  constructor(private router: Router, private httpClient: HttpClient, private dialog: MatDialog, private cd: ChangeDetectorRef) { 
    this.changeActorScreenData = history.state;
    this.currentUserName = this.changeActorScreenData.user.userName;
    this.valueChange = 0;
  }

  public currentUserName: string;

  public valueChange : number;

  @HostListener('window:popstate', ['$event'])
  onPopState() {
    this.router.navigate(this.visualizeNavigation, { state: this.changeActorScreenData.user });
  }

  ngOnInit(): void {
    if (this.changeActorScreenData.user.personId == undefined) {
      this.router.navigate(this.notFoundNavigation);
      return;
   }
 }

 public handleLogOutButtonClick(){
    this.changeActorScreenData = {} as ChangeActorData;
    this.router.navigate(this.homeNavigation);
 }

 public handleBackToVisualizeButtonClick(){
  this.router.navigate(this.visualizeNavigation, {
    state: {
      data : {
        metaUser: this.changeActorScreenData.user,
        indicator : this.changeActorScreenData.role
      }
    }
  });
 }
  
 public updateActorValue(): void {
  this.httpClient
    .put<Actor>(`http://${bckConfig.server}:${bckConfig.port}/actors/${this.changeActorScreenData.actor.id}`, {
      id : this.changeActorScreenData.actor.id,
      ownerId: this.changeActorScreenData.user.personId,
      valueChange: this.valueChange
    })
    .subscribe({
      next: this.onUpdatedActor,
      error: this.handleUpdateActorHttpErrorResponse.bind(this),
      complete: () => this.requestedActorUpdateCallback()
    });
}

  public change() : void{
    this.updateActorValue();
  }

  private onUpdatedActor = (response: Actor): void => {
    this.changeActorScreenData.actor.id = response.id;
    this.changeActorScreenData.actor.ownerId = response.ownerId;
    this.changeActorScreenData.actor.valueChange = response.valueChange;
  };

  private handleUpdateActorHttpErrorResponse(response: HttpErrorResponse): void {
    this.updateActorErrorOccurred = true;
    this.updateActorError = response.error.error;

    if (this.updateActorError == null || this.updateActorError == undefined) {
      this.updateActorError = 'Some error occurred during the updating of the actor. Try again later!';
    }

    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: this.updateActorError
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateActorError = '';
    });
  }

  private requestedActorUpdateCallback(): void {
    if (this.updateActorErrorOccurred) {
      this.updateActorErrorOccurred = false;
    }
    this.dialog.open(AlertDialogComponent, {
      data: {
        alertMessage: 'The actor was successfully updated!'
      }
    });
  }
}
