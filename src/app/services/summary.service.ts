import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private summaryData: string = '';

  // Save summary data to a service variable
  saveSummary(data: string): void {
    this.summaryData = data;
    console.log('Data saved in service:', this.summaryData);
  }

  // Retrieve summary data from the service
  getSummary(): string {
    return this.summaryData;
  }
}

