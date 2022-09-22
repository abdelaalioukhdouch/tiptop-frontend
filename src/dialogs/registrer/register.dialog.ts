import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.dialog.html',
  styleUrls: ['./register.dialog.scss']
})
export class RegisterDialog implements OnInit {

  signupForm: FormGroup;
  successMessage: String = '';
  constructor(private authService: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      gender: new FormControl("" ,[Validators.required, Validators.minLength(2)]),
      name: new FormControl("" ,[Validators.required, Validators.minLength(2)]),
      firstName: new FormControl("", [Validators.required, Validators.minLength(2)]),
      address: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
      confirm_password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value).subscribe((msg) => {
      console.log(msg);
      this._router.navigate(["login"]);
    });
    console.log("sign up");
  }

  movetologin() {
    this._router.navigate(['../login'], { relativeTo: this._activatedRoute });
  }
}