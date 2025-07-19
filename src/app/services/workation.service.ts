import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Workation } from '../models/workation.model';

@Injectable({
  providedIn: 'root'
})
export class WorkationService {
  private apiUrl = 'https://mutual-possum-supposedly.ngrok-free.app/workflex/workation';

  constructor(private http: HttpClient) {}

  
  getWorkations(): Observable<Workation[]> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    
    return this.http.get<Workation[]>(this.apiUrl, { headers });
  }
}

