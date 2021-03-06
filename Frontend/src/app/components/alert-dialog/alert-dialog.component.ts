import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
/**
 * The alert dialog component.
 */
export class AlertDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      alertMessage: string;
    }
  ) {}

  ngOnInit(): void {
    console.log('init');
  }

  public handleCancelButtonClick(): void {
    this.dialogRef.close();
  }
}
