import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
