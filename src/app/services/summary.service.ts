import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://localhost:3000/api/summary'; // Ensure this matches backend

  constructor(private http: HttpClient) {}

  // Fetch summary for a specific user
  getLatestSummary(userId: string): Observable<{ text: string }> {
    return this.http.get<{ text: string }>(`${this.apiUrl}/${userId}`);
  }

  // Save summary for a specific user
  saveSummary(summaryData: { userId: string; text: string }): Observable<any> {
    return this.http.post(this.apiUrl, summaryData);
  }
}
