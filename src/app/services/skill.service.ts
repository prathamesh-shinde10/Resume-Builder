import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = 'https://resumebuildernode.onrender.com/api/skill';

  constructor(private http: HttpClient) {}

  saveSkills(skillsData: { userId: string; skills: any[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, skillsData);
  }

  deleteSkill(skillId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${skillId}`);
  }

  getSkillsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}`);
  }
}
