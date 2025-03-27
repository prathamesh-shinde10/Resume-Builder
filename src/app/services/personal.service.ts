import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private apiUrl = 'https://resumebuildernode.onrender.com/api/personal';

  constructor(private http: HttpClient) {}

  // Fetch personal data for a specific userId
  getPersonalDataById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // Submit or update personal details
  submitPersonalData(personalData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, personalData);
  }
}
