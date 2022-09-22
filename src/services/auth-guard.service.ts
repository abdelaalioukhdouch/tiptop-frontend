import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { CacheHandler } from '../utils/cache-handler';

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (!CacheHandler.getStoredToken()) {
      this.router.navigate(["signup"]);
    }
    return true;
  }
}