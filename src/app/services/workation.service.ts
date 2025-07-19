import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Workation } from '../models/workation.model';

@Injectable({
  providedIn: 'root'
})
export class WorkationService {
  private apiUrl = 'https://mutual-possum-supposedly.ngrok-free.app/workflex/workation';

  constructor(private http: HttpClient) {}

  private mockData: Workation[] = [
    {
      id: 1,
      employee: 'Steffen Jacobs',
      origin: { country: 'Germany', code: 'DE' },
      destination: { country: 'United States', code: 'US' },
      start: '02/10/2024',
      end: '31/12/2024',
      workingDays: 65,
      risk: 'HIGH_RISK'
    },
    {
      id: 2,
      employee: 'Steffen Jacobs',
      origin: { country: 'Germany', code: 'DE' },
      destination: { country: 'Ukraine', code: 'UA' },
      start: '29/04/2023',
      end: '30/04/2023',
      workingDays: 1,
      risk: 'HIGH_RISK'
    },
    {
      id: 3,
      employee: 'Henry Duchamp',
      origin: { country: 'Belgium', code: 'BE' },
      destination: { country: 'Spain', code: 'ES' },
      start: '01/09/2022',
      end: '01/03/2023',
      workingDays: 131,
      risk: 'HIGH_RISK'
    },
    {
      id: 4,
      employee: 'Andre Fischer',
      origin: { country: 'Germany', code: 'DE' },
      destination: { country: 'Greece', code: 'GR' },
      start: '22/04/2023',
      end: '30/06/2023',
      workingDays: 50,
      risk: 'NO_RISK'
    },
    {
      id: 5,
      employee: 'Ayushi Singh',
      origin: { country: 'Germany', code: 'DE' },
      destination: { country: 'India', code: 'IN' },
      start: '13/03/2023',
      end: '30/04/2023',
      workingDays: 35,
      risk: 'LOW_RISK'
    }
  ];

  getWorkations(): Observable<Workation[]> {
    return of(this.mockData);
  }
//   getWorkations(): Observable<Workation[]> {
//     return this.http.get<Workation[]>(this.apiUrl);
//   }
}

