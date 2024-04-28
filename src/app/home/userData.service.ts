import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  constructor(private cookieService: CookieService) {}

  storeUserDataInCookie(user: any) {
    const userData = JSON.stringify(user);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Set the cookie to expire in 7 days
    this.cookieService.set('userData', userData, expires, '/', undefined, true, 'Lax');
  }

  retrieveUserDataFromCookie(): any {
    const userData = this.cookieService.get('userData');
    if (userData) {
      const decodedData = decodeURIComponent(userData);
      return JSON.parse(decodedData);
    } else {
      return null;
    }
  }

  clearUserDataCookie() {
    this.cookieService.delete('userData', '/');
  }
}
