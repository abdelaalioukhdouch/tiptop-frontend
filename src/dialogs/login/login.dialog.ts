import { isNullOrUndefined } from 'util';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterDialog } from '../registrer/register.dialog';
import { AuthService } from 'src/services/auth.service';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.dialog.html',
  styleUrls: ['./login.dialog.scss']
})
export class LoginDialog implements OnInit {
  isLoading = false;
  hide = "password";

  loginForm: FormGroup;
  loginSuccessMessage: string;


  constructor(private authService: AuthService, private dialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
    /* this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
    */
  }

  ngOnInit() {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  register() {
    const dialogCard = this.dialog.open(RegisterDialog, {
      width: '70%',
      height: '80%',
      panelClass: 'mat-dialog-any-padding',
      autoFocus: false
    });

    dialogCard.afterClosed().subscribe(async rslt => {
      if (!(rslt === undefined)) {
        //const dialogCard = this.dialog.open(WelcomeDialog, {
        //  width: '70rem',
        //height: '30rem',
        // panelClass: 'mat-dialog-information',
        //autoFocus: false
        // });
      }
    });
  }

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login(): void {
    this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(res => {
          if(res) {
            this.loginSuccessMessage = "Vous êtes connecté"; // Set the success message
            this._router.navigate(['/']);
  
            // Hide the message after 3 seconds
            of(null).pipe(delay(1100)).subscribe(() => {
              this.loginSuccessMessage = null;
              this.dialog.closeAll();

            });
          } else {
            alert("Unauthenticated. Try again!");
          }
        });
}


  movetoregister() {
    this._router.navigate(['../register'], { relativeTo: this._activatedRoute });
  }
}