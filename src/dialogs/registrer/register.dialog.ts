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

  get passwordErrors() {
    const passwordControl = this.signupForm.get('password');

    if (passwordControl.errors?.['required']) {
      return 'Un mot de passe est requis.';
    } else if (passwordControl.errors?.['minlength']) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    } else if (passwordControl.errors?.['pattern']) {
      return 'Le mot de passe doit contenir au moins une majuscule, une minuscule, et un chiffre.';
    }

    return null;
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
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ]),
      confirm_password: new FormControl("", [
        Validators.required
        // Ajouter ici un validateur personnalisé pour la confirmation du mot de passe si nécessaire
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