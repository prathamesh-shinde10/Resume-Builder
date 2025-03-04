// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { FormArray,FormGroup, FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
// import { ExperienceService } from '../../services/experience.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-experience',
//   standalone: true,
//   imports: [CommonModule,ReactiveFormsModule],
//   templateUrl: './experience.component.html',
//   styleUrl: './experience.component.css'
// })
// export class ExperienceComponent implements OnInit {
//   expform: FormGroup;

//   constructor(
//     private router: Router,
//     private fb: FormBuilder,
//     private experienceService: ExperienceService
//   ) {
//     this.expform = this.fb.group({
//       experienceDetails: this.fb.array([this.createExperienceGroup()]), // Initialize with one form group
//     });
//   }

//   ngOnInit(): void {
//     const savedData = this.experienceService.getExperienceData();
//     if (savedData) {
//       this.setExperienceData(savedData);
//     }
//   }

//   get experienceDetails(): FormArray {
//     return this.expform.get('experienceDetails') as FormArray;
//   }

//   createExperienceGroup(): FormGroup {
//     return this.fb.group({
//       comp: ['', Validators.required],
//       job: ['', Validators.required],
//       adr: ['', Validators.required],
//       Start: ['', Validators.required],
//       end: ['', Validators.required],
//     });
//   }

//   addForm(): void {
//     this.experienceDetails.push(this.createExperienceGroup());
//   }

//   removeForm(index: number): void {
//     if (this.experienceDetails.length > 1) {
//       this.experienceDetails.removeAt(index);
//     }
//   }

//   onSubmit(): void {
//     if (this.expform.valid) {
//       this.experienceService.saveExperienceData(this.expform.value);
//       alert('Experience details saved successfully!');
//     } else {
//       alert('Please fill out all required fields.');
//     }
//   }

//   setExperienceData(data: any): void {
//     this.experienceDetails.clear();
//     data.experienceDetails.forEach((item: any) => {
//       this.experienceDetails.push(this.fb.group(item));
//     });
//   }

//   navigateToSkill(): void {
//     this.router.navigate(['/profile/skill']);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExperienceService } from '../../services/experience.service';
import { CommonModule } from '@angular/common';

interface ExperienceEntry {
  _id?: string;
  userId: string;
  comp: string;
  job: string;
  adr: string;
  Start: string;
  end: string;
}

@Component({
   selector: 'app-experience',
   standalone: true,
   imports: [CommonModule,ReactiveFormsModule],
   templateUrl: './experience.component.html',
   styleUrl: './experience.component.css'
 })
export class ExperienceComponent implements OnInit {


  expform!: FormGroup;
  userId: string | null = null;
  isSavedArray: boolean[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private experienceService: ExperienceService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.initForm();
    
    if (!this.userId) {
      console.log('No user ID found. Unable to fetch experience data.');
      return;
    }
    this.loadExperienceData(this.userId);
  }

  private initForm(): void {
    this.expform = this.fb.group({
      experienceDetails: this.fb.array([])
    });
  }

  get experienceDetails(): FormArray {
    return this.expform.get('experienceDetails') as FormArray;
  }

  createExperienceGroup(data?: ExperienceEntry): FormGroup {
    return this.fb.group({
      comp: [data?.comp || '', Validators.required],
      job: [data?.job || '', Validators.required],
      adr: [data?.adr || '', Validators.required],
      Start: [data?.Start || '', Validators.required],
      end: [data?.end || '', Validators.required],
      _id: [data?._id || null]
    });
  }

  addForm(): void {
    this.experienceDetails.push(this.createExperienceGroup());
    this.isSavedArray.push(false);
  }

  onSubmit(index: number): void {
    if (!this.userId) {
      alert('User ID not found. Please log in.');
      return;
    }

    const entry = this.experienceDetails.at(index)?.value as ExperienceEntry;
    if (!entry) return;
    
    const newEntry = { ...entry, userId: this.userId };

    this.experienceService.saveExperienceData(newEntry).subscribe({
      next: () => {
        alert('Experience saved successfully!');
        this.isSavedArray[index] = true;
        this.loadExperienceData(this.userId!);
      },
      error: (error) => {
        console.error('Error saving experience:', error);
        alert('Failed to save experience.');
      }
    });
  }

  removeForm(index: number): void {
    const entryToDelete = this.experienceDetails.at(index)?.value;
    if (!entryToDelete) return;

    if (entryToDelete._id) {
      this.experienceService.deleteExperienceEntry(entryToDelete._id).subscribe({
        next: () => {
          console.log('Experience deleted:', entryToDelete._id);
          this.experienceDetails.removeAt(index);
          alert('Experience entry deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting entry:', error);
          alert('Failed to delete experience.');
        }
      });
    } else {
      this.experienceDetails.removeAt(index);
    }
  }

  loadExperienceData(userId: string): void {
    console.log('Fetching experience data for:', userId);
  
    this.experienceService.getExperienceData(userId).subscribe({
      next: (data) => {
        console.log('Fetched data:', data);
        this.experienceDetails.clear();
        this.isSavedArray = [];
  
        if (data.length > 0) {
          data.forEach((experience: ExperienceEntry) => {
            this.experienceDetails.push(this.createExperienceGroup(experience));
            this.isSavedArray.push(true);
          });
        } else {
          console.log('No experience data found. Initializing blank form.');
          this.addForm();
        }
      },
      error: (error) => {
        console.error('Error fetching experience data:', error);
        this.addForm();
      }
    });
  }
  
  navigateToSkill(): void {
    this.router.navigate(['/profile/skill']);
  }
}
