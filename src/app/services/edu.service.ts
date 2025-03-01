import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduService {
  private apiUrl = 'http://localhost:3000/api/education';

  constructor(private http: HttpClient) {}

  // Save education data for a specific user
  saveEducationData(educationData: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, educationData); 
  }
  

  // Fetch education data for the logged-in user
  loadEducationData(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`); 

}


  // Delete specific education entry
  deleteEducationEntry(id: string): Observable<any> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
