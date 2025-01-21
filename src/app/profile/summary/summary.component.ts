import { Component ,OnInit } from '@angular/core';
import { SummaryService } from '../../services/summary.service';
import { CommonModule } from '@angular/common';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent  implements OnInit {
  sumform!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.sumform = this.fb.group({
      txt: ['', [Validators.required, Validators.minLength(100)]]
    });

    // Load saved data from session storage if available
    const savedData = sessionStorage.getItem('summaryData');
    if (savedData) {
      this.sumform.patchValue({ txt: savedData });
    }
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.sumform.valid) {
      const formData = this.sumform.value.txt;

      // Save data to session storage
      sessionStorage.setItem('summaryData', formData);

      // Save data to service
      this.summaryService.saveSummary(formData);

      console.log('Form Data Saved:', formData);
      alert('Data saved successfully!');
    } else {
      console.log('Form is invalid!');
    }
  }

  // Method to navigate to the experience page
  navigateToExperience(): void {
    this.router.navigate(['/profile/exp']);
  }
}