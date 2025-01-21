import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {

  private readonly STORAGE_KEY = 'experienceData';

  /**
   * Saves experience data to session storage.
   */
  saveExperienceData(data: any): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Retrieves experience data from session storage.
   */
  getExperienceData(): any {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Clears all saved experience data from session storage.
   */
  clearExperienceData(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}