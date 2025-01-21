import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly STORAGE_KEY = 'skillDetails';

  // Save skills to session storage
  saveSkills(data: any[]): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Retrieve skills from session storage
  getSkills(): any[] {
    const savedSkills = sessionStorage.getItem(this.STORAGE_KEY);
    return savedSkills ? JSON.parse(savedSkills) : [];
  }

  // Clear all saved skills from session storage
  clearSkills(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}