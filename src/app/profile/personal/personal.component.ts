import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule,FormGroup,FormControl,FormsModule,Validators } from '@angular/forms';
import { PersonalService } from '../../services/personal.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  personalform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    job: new FormControl('', [Validators.required]),
    add: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mob: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}')]),
    link: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  

  userId: string = ''; // Stores the logged-in user's ID

  constructor(private router: Router, private personalService: PersonalService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      this.loadFormData(this.userId);
    } else {
      console.error('No user ID found in localStorage.');
    }
  }

  // Load form data from backend for specific user
  loadFormData(userId: string) {
    this.personalService.getPersonalDataById(userId).subscribe({
      next: (response: any) => {
        console.log('Retrieved personal data:', response);
        if (response.success && response.data) {
          this.personalform.patchValue({
            name: response.data.name || '',
            job: response.data.job || '',
            add: response.data.add || '',
            email: response.data.email || '',
            mob: response.data.mob || '',
            link: response.data.link || '',
          });
        } else {
          console.warn('No personal data found.');
        }
      },
      error: (err: any) => {
        console.error('Error fetching personal details:', err);
      },
    });
  }

  onSubmit() {
    if (this.personalform.valid && this.userId) {
      const personalDetails = { userId: this.userId, ...this.personalform.value };

      this.personalService.submitPersonalData(personalDetails).subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Personal details saved successfully!');
            this.loadFormData(this.userId); // Reload data after saving
            // this.router.navigate(['/profile/edu']);
          } else {
            alert('Failed to save personal details.');
          }
        },
        error: (err: any) => {
          console.error('Error:', err);
          alert('An error occurred while saving personal details.');
        },
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
  navigateToEducation() {
    this.router.navigate(['/profile/edu']);
  }
}
