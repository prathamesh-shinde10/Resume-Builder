import { Component, OnInit } from '@angular/core';
import { SummaryService } from '../../services/summary.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  sumform!: FormGroup;
  userId: string | null = null; // Store logged-in user ID

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    // Initialize form
    this.sumform = this.fb.group({
      txt: ['', Validators.required]
    });

    // Fetch existing summary if user is logged in
    if (this.userId) {
      this.fetchSummary();
    }
  }

  fetchSummary(): void {
    this.summaryService.getLatestSummary(this.userId!).subscribe({
      next: (response) => {
        if (response && response.text) {
          this.sumform.patchValue({ txt: response.text });
        }
      },
      error: () => {
        console.log('No previous summary found for this user.');
      }
    });
  }

  onSubmit(): void {
    if (this.sumform.valid && this.userId) {
      const formData = {
        userId: this.userId, // Include userId in the request
        text: this.sumform.value.txt
      };

      this.summaryService.saveSummary(formData).subscribe({
        next: (response) => {
          console.log('Summary saved:', response);
          alert('Summary saved successfully!');
        },
        error: (error) => {
          console.error('Error saving summary:', error);
          alert('Failed to save summary.');
        }
      });
    } else {
      alert('Please enter a summary before saving.');
    }
  }

  // Navigate to the experience page
  navigateToExperience(): void {
    this.router.navigate(['/profile/exp']);
  }
}
