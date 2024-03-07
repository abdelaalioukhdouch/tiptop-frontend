import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from 'src/dialogs/login/login.dialog';

@Component({
  selector: 'details-jeu',
  templateUrl: './details-jeu.html',
  styleUrls: ['./details-jeu.scss']
})
export class DetailsView implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  logIn(): void {
    const dialogCard = this.dialog.open(LoginDialog, {
        width: '70%',
        height: '80%',
        panelClass: 'mat-dialog-any-padding',
        autoFocus: false
    });

    dialogCard.afterClosed().subscribe(rslt => {
       // if(rslt == "FORGET_PASSWORD")
         //   this.forgetPassword();
    });
}

}
