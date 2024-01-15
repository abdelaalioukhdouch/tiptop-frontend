import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject, throwError, Subject } from "rxjs";

import { first, catchError, tap, map } from 'rxjs/operators';
import { ErrorHandlerService } from "./error-handler.service";
import { User } from "src/models/User";
import { CacheHandler } from '../utils/cache-handler';
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class AuthService {
  // changed it to our local server 8080
  private url = environment.apiUrl;
  private isAuthenticated = false;
  //private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  public err = new BehaviorSubject<any>(null);


  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id_user">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  public baseUrl = '';
  public token: String = '';
  public headers: any;
  __isHttpWaiting = false;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    // private toastr: ToastrService
  ) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  signup(user: Omit<User, "id_user">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/auth/register`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      );
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    // role: string;
    userId: Pick<User, "id_user">;
  }> {
    return this.http
      .post(`${this.url}/auth/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: { token: string; userId: Pick<User, "id_user"> }) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          CacheHandler.storeLoginData(tokenObject);
          this.isUserLoggedIn$.next(true);
          this.router.navigate(["home"]);
        }),
        catchError(
          this.errorHandlerService.handleError<{
            token: string;
            userId: Pick<User, "id_user">;
          }>("login")
        )
      );
  }

  cacheMap: any = {};

  get(url: any, options?: HttpOptions): Observable<any> {
    try {
      if (url[url.length - 1] == '&') {
        url = url.substr(0, url.length - 1);
      }
    } catch (err) { }

    if (options && options.fromCache) {
      if (this.cacheMap[url]) {
        return <any>this.cacheMap[url];
      }
    }

    this.__isHttpWaiting = true;
    let pipe = this.http.get(url, { headers: this.jwt(options) })
      .pipe(
        map(r => {
          this.__isHttpWaiting = false;
          return r;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error, url, options))
      );
    if (options && options.fromCache) {
      this.cacheMap[url] = pipe;
    }
    return pipe;
  }

  post(url: string, body: any, options?: HttpOptions) {
    try {
      if (url[url.length - 1] == '&') {
        url = url.substr(0, url.length - 1);
      }
    } catch (err) { }
    this.__isHttpWaiting = true;
    return this.http.post(url, body, { headers: this.jwt(options) })
      .pipe(
        map(r => {
          this.__isHttpWaiting = false;
          return r;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error, url))
      );
  }

  put(url: string, body: any) {
    try {
      if (url[url.length - 1] == '&') {
        url = url.substr(0, url.length - 1);
      }
    } catch (err) { }
    this.__isHttpWaiting = true;
    return this.http.put(url, body, { headers: this.jwt() })
      .pipe(
        map(r => {
          this.__isHttpWaiting = false;
          return r;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error, url))
      );
  }

  patch(url: string, body: any) {
    try {
      if (url[url.length - 1] == '&') {
        url = url.substr(0, url.length - 1);
      }
    } catch (err) { }
    this.__isHttpWaiting = true;
    return this.http.patch(url, body, { headers: this.jwt() })
      .pipe(
        map(r => {
          this.__isHttpWaiting = false;
          return r;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error, url))
      );
  }

  delete(url: string, options?: HttpOptions) {
    try {
      if (url[url.length - 1] == '&') {
        url = url.substr(0, url.length - 1);
      }
    } catch (err) { }
    this.__isHttpWaiting = true;
    return this.http.delete(url, { headers: this.jwt(options) })
      .pipe(
        map(r => {
          this.__isHttpWaiting = false;
          return r;
        }),
        catchError((error: HttpErrorResponse) => this.handleError(error, url, options))
      );
  }

  public jwt(options?: HttpOptions) {
    this.token = CacheHandler.getStoredToken();
    if (!this.token) {
        if (!options || !options.ignoreLogout) {
            localStorage.setItem("rAlogin", this.router.url);
            // this.logOut();
        }
        return null;
    } else {
        this.token = CacheHandler.getStoredToken();
        this.headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        });
        return this.headers;
    }
}

  handleError(err: any, url: string, options?: HttpOptions) {
    this.__isHttpWaiting = false;
    if (err.status == 401 || err.status == 402) {

      if (!options || !options.ignoreToast) {
        // this.toastr.clear();
        // this.toastr.error(
        //   err && err.error && err.error.message ? err.error.message : err.statusText,
        //   "Session Failed / Timed Out",
        //   { timeOut: 0 }
        // );
      }
      // localStorage.setItem("rAlogin", this.router.url);
      // this.logOut(err, url);
    } else if (err.status == 0) {
      if (!options || !options.ignoreToast) {
        // this.toastr.info(
        //   "Something went wrong!",
        //   "Please try again later",
        //   { timeOut: 3000 }
        // );
      }
    } else if (err.status == 403) {
      if (!options || !options.ignoreToast) {
        // this.toastr.clear();
        // this.toastr.error(
        //   err.error.message,
        //   "Permission Denied",
        //   { disableTimeOut: true }
        // );
      }
    } else if (err.status == 429) {
      if (!options || !options.ignoreToast) {
        // this.toastr.clear();
        // this.toastr.warning(
        //   err.error.message,
        //   err.error.message2 || `Please try again later!`,
        //   { disableTimeOut: true }
        // );
      }
    }

    return throwError(err);

  }


  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }
  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");

    localStorage.removeItem("profile");
    localStorage.removeItem("uname");
  }
}


export interface HttpOptions {
  fromCache?: boolean;
  ignoreToast?: boolean;
  ignoreLogout?: boolean;
  ignoreSpinner?: boolean;
}

