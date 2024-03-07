import { isNullOrUndefined } from 'util';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterDialog } from '../registrer/register.dialog';
import { AuthService } from 'src/services/auth.service';
import { delay, of } from 'rxjs';
import { ProfileService } from 'src/services/profile.service';

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

  userRole: any | null = null;userIsAuthenticated: boolean;
  profile: { id: any; username: any; bio: any; imagePath: any; creator: any; role: any; };
;



  constructor(private authService: AuthService, private dialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute, private cdRef: ChangeDetectorRef,
    private profileService: ProfileService,
    ) {
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

    dialogCard.afterClosed().subscribe(result => {
      if (result === 'LOGGED_IN') { // Assurez-vous que le dialogue renvoie ce résultat après une connexion réussie
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.getProfile();
      }
    });
  }

  getProfile() {
    this.profileService.getProfileByCreatorId().subscribe(prof => {
      //this.profileisSet = true
      //this.username = prof.profile.username
      this.userRole = prof.profile.role
      this.profile = {
        id: prof.profile._id,
        username: prof.profile.username,
        bio: prof.profile.bio,
        imagePath: prof.profile.imagePath,
        creator: prof.profile.creator,
        role: prof.profile.role
      };
      //this.userIsAdmin = this.profile.role === 'admin';

    },
      err => {
        
      })

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
            this.authService.saveUserData(res);
            this.userRole = res.user.role;
            //console.log(res)
            this._router.navigate(['/home']);
            localStorage.setItem("token", "your_new_token");
            localStorage.setItem("userId", "your_new_userId");
  
            // Hide the message after 3 seconds
            of(null).pipe(delay(1100)).subscribe(() => {
              this.loginSuccessMessage = null;
              this.dialog.closeAll();

            });
            this.cdRef.detectChanges();
          } else {
            alert("Unauthenticated. Try again!");
          }
        });
}


  movetoregister() {
    this._router.navigate(['../register'], { relativeTo: this._activatedRoute });
  }
}