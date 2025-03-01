import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EduService } from '../../services/edu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule, Validators, FormArray } from '@angular/forms';

interface EducationEntry {
  id?: string; // Unique ID for existing records
  qly: string;
  clg: string;
  uni: string;
  compl: string;
  percentage: string;
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

  userId: string | null = null;
  existingEducation: EducationEntry[] = []; // Store fetched data

  constructor(private router: Router, private eduService: EduService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); 

    if (this.userId) {
      this.loadEducationData(this.userId);
    } else {
      console.warn('No user logged in. Initializing blank form.');
      this.addForm(); 
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
      percentage: new FormControl('', [Validators.required]),
    });
    this.educationDetails.push(newEducationForm);
  }

  removeForm(index: number): void {
    this.educationDetails.removeAt(index);
  }

  onSubmit(index: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }
  
    const entry = this.educationDetails.at(index).value as any;
    const newEntry = { ...entry, percentage: Number(entry.percentage), userId };
  
    this.eduService.saveEducationData([newEntry]).subscribe({
      next: (response) => {
        alert('Education details saved successfully!');
        this.loadEducationData(userId); // Refresh the data from the database
      },
      error: (error) => {
        console.error('Error saving education data:', error);
        alert('Failed to save education details.');
      }
    });
  }
  
  

  loadEducationData(userId: string): void {
    this.eduService.loadEducationData(userId).subscribe({
      next: (data) => {
        this.existingEducation = data; 
        this.educationDetails.clear();

        if (data.length > 0) {
          data.forEach((education: any) => {
            this.educationDetails.push(new FormGroup({
              qly: new FormControl(education.qly, [Validators.required]),
              clg: new FormControl(education.clg, [Validators.required]),
              uni: new FormControl(education.uni, [Validators.required]),
              compl: new FormControl(education.compl, [Validators.required]),
              percentage: new FormControl(education.percentage, [Validators.required]),
            }));
          });
        } else {
          console.log('No education data found. Initializing blank form.');
          this.addForm();
        }
      },
      error: (error) => {
        console.error('Error fetching education data:', error);
        this.addForm();
      }
    });
  }

  removeEducation(index: number): void {
    const entryToDelete = this.educationDetails.at(index).value;
  
    if (entryToDelete.id) { // Only delete from DB if it exists
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
