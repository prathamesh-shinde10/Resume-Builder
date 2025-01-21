import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EduService {

  private sessionStorageKey = 'educationDetails';

  constructor() {}

  // Save education data to session storage
  saveEducationData(data: any[]): void {
    try {
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving education data:', error);
    }
  }

  // Load education data from session storage
  loadEducationData(): any[] {
    const savedData = sessionStorage.getItem(this.sessionStorageKey);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved education data:', error);
        return [];
      }
    }
    return [];
  }

}
