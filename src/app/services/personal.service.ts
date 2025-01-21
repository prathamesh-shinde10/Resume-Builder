import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private personalData = new BehaviorSubject<any>(null);

  // Observable for other components to subscribe to
  personalData$ = this.personalData.asObservable();

  // Method to update personal data
  updatePersonalData(data: any) {
    this.personalData.next(data);
  }
}
