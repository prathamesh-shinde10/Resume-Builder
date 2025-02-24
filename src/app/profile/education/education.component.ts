import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EduService } from '../../services/edu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators, FormArray } from '@angular/forms';
   

interface EducationEntry {
  qly: string;
  clg: string;
  uni: string;
  compl: string;
  per: string;
}


@Component({
  selector: 'app-education',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnInit {
  eduform = new FormGroup({
    educationDetails: new FormArray([])
  });

  userId: string | null = null; // Store userId from localStorage

  constructor(private router: Router, private eduService: EduService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (this.userId) {
      this.loadEducationData(this.userId);
    } else {
      console.warn('No user logged in. Initializing blank form.');
      this.addForm(); // Ensure at least one blank form field for new users
    }
  }

  get educationDetails(): FormArray {
    return this.eduform.get('educationDetails') as FormArray;
  }

  addForm(): void {
    const newEducationForm = new FormGroup({
      qly: new FormControl('', [Validators.required]),
      clg: new FormControl('', [Validators.required]),
      uni: new FormControl('', [Validators.required]),
      compl: new FormControl('', [Validators.required]),
      per: new FormControl('', [Validators.required]),
    });
    this.educationDetails.push(newEducationForm);
  }

  removeForm(index: number): void {
    this.educationDetails.removeAt(index);
  }

  onSubmit(): void {
    if (this.eduform.valid) {
      const userId = localStorage.getItem('userId'); // Get userId from local storage
  
      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }
  
      const educationData = this.educationDetails.value.map((entry: any) => ({
        ...entry,
        userId // Attach userId to each entry
      }));
  
      this.eduService.saveEducationData(educationData).subscribe({
        next: () => {
          alert('Education details saved successfully!');
          this.loadEducationData(userId); // ✅ Pass userId when calling the function
        },
        error: (error) => {
          console.error('Error saving education data:', error);
          alert('Failed to save education details. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
  

  loadEducationData(userId: string): void {
    this.eduService.loadEducationData(userId).subscribe({
      next: (data) => {
        this.educationDetails.clear();

        if (data.length > 0) {
          data.forEach((education: any) => {
            this.educationDetails.push(new FormGroup({
              qly: new FormControl(education.qly, [Validators.required]),
              clg: new FormControl(education.clg, [Validators.required]),
              uni: new FormControl(education.uni, [Validators.required]),
              compl: new FormControl(education.compl, [Validators.required]),
              per: new FormControl(education.per, [Validators.required]),
            }));
          });
        } else {
          console.log('No education data found. Initializing blank form.');
          this.addForm(); // Show a blank form for new users
        }
      },
      error: (error) => {
        console.error('Error fetching education data:', error);
        this.addForm(); // Ensure at least one empty form if there's an error
      }
    });
  }

  removeEducation(index: number): void {
    const entryToDelete = this.educationDetails.at(index).value;
    
    if (entryToDelete.id) {
      // Send request to backend to delete the entry
      this.eduService.deleteEducationEntry(entryToDelete.id).subscribe({
        next: () => {
          this.educationDetails.removeAt(index);
          alert('Education entry deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete education entry.');
        }
      });
    } else {
      this.educationDetails.removeAt(index);
    }
  }

  navigateToSummary() {
    this.router.navigate(['/profile/summ']);
  }
}
