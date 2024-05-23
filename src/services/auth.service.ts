import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject, throwError, Subject } from "rxjs";

import { first, catchError, tap, map } from 'rxjs/operators';
import { ErrorHandlerService } from "./error-handler.service";
import { User } from "src/models/User";
import { CacheHandler } from '../utils/cache-handler';
import { environment } from "src/environments/environment";

interface LoginResponse {
  token: string;
  userId: Pick<User, "id_user">;
  user: User;
}

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
  private currentUser: any;

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "id_user">;


  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  public baseUrl = '';
  public token: String = '';
  public user: [];
  public headers: any;
  __isHttpWaiting = false;

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router,
    // private toastr: ToastrService
  ) {
    // Retrieve token from local storage upon initialization
    this.token = localStorage.getItem("token");
    
    // Check if token exists and update authentication status accordingly
    this.isAuthenticated = !!this.token;
    // Notify subscribers about the authentication status
    this.authStatusListener.next(this.isAuthenticated);
  }
  

  //test unit

  authenticate() {
    console.log('Authentication successful!');
  }


// Store user data upon login
saveUserData(userData: any) {
  localStorage.setItem('userData', JSON.stringify(userData));
}

 // Retrieve user data
 getUserData() {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
}

getCurrentUser() {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}

// Method to get the current user's role
getUserRole(): string {
  // Assuming the user object has a 'role' property
  return this.currentUser?.role;
}

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
  clearLocalStorage() {
    localStorage.clear();
  }

  refreshToken(): Observable<{ token: string }> {
    const refreshTokenPayload = {
      refreshToken: this.token, // Send the current token
    };

    // Make an HTTP request to your server to refresh the token
    return this.http.post<{ token: string }>(
      `${this.url}/refresh-token`,
      refreshTokenPayload
    );
  }

  updateToken(newToken: string): void {
    this.token = newToken;
    // Store the new token in local storage or your preferred storage mechanism
    localStorage.setItem("token", newToken);
  }

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<{
    token: string;
    user: User;
    userId: Pick<User, "id_user">;
  }> {
    return this.http
      .post(`${this.url}/auth/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: LoginResponse)=> {
          this.userId = tokenObject.userId;
          this.clearLocalStorage();

        
 localStorage.setItem("token", tokenObject.token);
 // Store user details as needed; for example:
 localStorage.setItem("user", JSON.stringify(tokenObject.user));
 
          
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          CacheHandler.storeLoginData(tokenObject);
          this.isUserLoggedIn$.next(true);
          //this.router.navigate(["/home"]);
          
        }),
        catchError(
          this.errorHandlerService.handleError<{
            token: string;
            userId: Pick<User, "id_user">;
            user: User;
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
    localStorage.clear();
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  
    // Redirection vers la page de connexion
    // this.router.navigate(["/"]).then(() => {
    //   window.location.reload(); // Rafraîchit la page après la redirection
    // });
  }
  

  private clearAuthData() {
    for (const key in localStorage) {
      if (key !== 'cookiesAccepted') {
        localStorage.removeItem(key);
      }
    }
  }
}


export interface HttpOptions {
  fromCache?: boolean;
  ignoreToast?: boolean;
  ignoreLogout?: boolean;
  ignoreSpinner?: boolean;
}

