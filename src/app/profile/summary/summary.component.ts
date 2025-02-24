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
    this.sumform = this.fb.group({
      txt: ['', [Validators.required, Validators.minLength(100)]]
    });
  
    this.summaryService.getLatestSummary().subscribe({
      next: (response) => {
        this.sumform.patchValue({ txt: response.text });
      },
      error: (error) => {
        console.log('No previous summary found.');
      }
    });
  }
  // Method to handle form submission
  onSubmit(): void {
    if (this.sumform.valid) {
      const formData = this.sumform.value.txt;
  
      this.summaryService.saveSummary(formData).subscribe({
        next: (response) => {
          console.log('Form Data Saved:', response);
          alert('Data saved successfully!');
        },
        error: (error) => {
          console.error('Error saving data:', error);
          alert('Failed to save data.');
        }
      });
    } else {
      console.log('Form is invalid!');
    }
  }
  
  // Method to navigate to the experience page
  navigateToExperience(): void {
    this.router.navigate(['/profile/exp']);
  }
}