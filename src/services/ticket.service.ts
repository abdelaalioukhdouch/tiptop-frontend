import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Appsettings } from 'src/app/app.settings';
@Injectable({
    providedIn: 'root'
})
export class TicketService {
    // Node/Express API
    private REST_API: string = `${Appsettings.API_ENDPOINT}/ticket`;
    // Http Header
    httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private httpClient: HttpClient) { }
    // Add
    participate(code: string): Observable<any> {
        let API_URL = `${this.REST_API}/consume?code=${code}`;
        return this.httpClient.get(API_URL)
            .pipe(
                catchError(this.handleError)
            )
    }

    selectWinner(): Observable<any> {
        const API_URL = `${this.REST_API}/select-winner`;
        return this.httpClient.get(API_URL).pipe(catchError(this.handleError));
    }

    // Error 
    handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Handle client error
            errorMessage = error.error.message;
        } else {
            // Handle server error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log(errorMessage);
        return throwError(error);
    }
}