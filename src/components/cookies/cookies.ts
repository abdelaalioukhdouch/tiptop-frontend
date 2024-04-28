import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'cookies',
  templateUrl: './cookies.html',
  styleUrls: ['./cookies.scss']
})

export class CookiesComponent{

  
  constructor(public dialogRef: MatDialogRef<CookiesComponent>) {}

  onAccept(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    this.dialogRef.close();
  }

  onDecline(): void {
    localStorage.setItem('cookiesAccepted', 'false');
    this.dialogRef.close();
  }
}
