import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appsettings } from 'src/app/app.settings';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http: HttpClient
  ) { }

  getTickets(q?) {
    let url = `${Appsettings.API_ENDPOINT}/ticket`;
    if(q) url += `?${q}`;
    return this.http.get(url);
  }

  deleteTicket(id: string) {
    let url = `${Appsettings.API_ENDPOINT}/ticket/${id}`;
    return this.http.delete(url);
  }

  getGains(q?) {
    let url = `${Appsettings.API_ENDPOINT}/gain`;
    if(q) url += `?${q}`;
    return this.http.get(url);
  }

  deleteGain(gainId: string): Observable<void> {
    const url = `${Appsettings.API_ENDPOINT}/gain/${gainId}`;
    return this.http.delete<void>(url);
  }
}
