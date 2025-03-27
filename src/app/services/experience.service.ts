// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ExperienceService {

//   private readonly STORAGE_KEY = 'experienceData';

//   /**
//    * Saves experience data to session storage.
//    */
//   saveExperienceData(data: any): void {
//     sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
//   }

//   /**
//    * Retrieves experience data from session storage.
//    */
//   getExperienceData(): any {
//     const data = sessionStorage.getItem(this.STORAGE_KEY);
//     return data ? JSON.parse(data) : null;
//   }

//   /**
//    * Clears all saved experience data from session storage.
//    */
//   clearExperienceData(): void {
//     sessionStorage.removeItem(this.STORAGE_KEY);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private apiUrl = 'https://resumebuildernode.onrender.com/api/experience';
 

  constructor(private http: HttpClient) {}

  // Fetch experience data for a user
  getExperienceData(userId: string): Observable<any> {
    console.log('📡 Fetching experience data for:', userId);
    return this.http.get<any>(`https://resumebuildernode.onrender.com/api/experience/${userId}`);
  }
  
  

  // Save a new experience entry
  saveExperienceData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Delete an experience entry
  deleteExperienceEntry(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
