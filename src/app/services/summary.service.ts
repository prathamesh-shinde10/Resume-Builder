import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SummaryService {
   
  private apiUrl = 'http://localhost:3000/api/summary'; 

  constructor(private http: HttpClient) {}

  // Save summary to the backend
  saveSummary(text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, { text }).pipe(
      catchError(error => {
        console.error('Error saving summary:', error);
        return throwError(() => new Error('Failed to save summary.'));
      })
    );
  }

  // Fetch the latest summary from backend
  getLatestSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/latest`).pipe(  
      catchError(error => {
        console.error('Error fetching summary:', error);
        return throwError(() => new Error('Failed to fetch summary.'));
      })
    );
  }
}
  // private summaryData: string = '';

  // // Save summary data to a service variable
  // saveSummary(data: string): void {
  //   this.summaryData = data;
  //   console.log('Data saved in service:', this.summaryData);
  // }

  // // Retrieve summary data from the service
  // getSummary(): string {
  //   return this.summaryData;
  // }


