import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray,FormGroup, FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { ExperienceService } from '../../services/experience.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  expform: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private experienceService: ExperienceService
  ) {
    this.expform = this.fb.group({
      experienceDetails: this.fb.array([this.createExperienceGroup()]), // Initialize with one form group
    });
  }

  ngOnInit(): void {
    const savedData = this.experienceService.getExperienceData();
    if (savedData) {
      this.setExperienceData(savedData);
    }
  }

  get experienceDetails(): FormArray {
    return this.expform.get('experienceDetails') as FormArray;
  }

  createExperienceGroup(): FormGroup {
    return this.fb.group({
      comp: ['', Validators.required],
      job: ['', Validators.required],
      adr: ['', Validators.required],
      Start: ['', Validators.required],
      end: ['', Validators.required],
    });
  }

  addForm(): void {
    this.experienceDetails.push(this.createExperienceGroup());
  }

  removeForm(index: number): void {
    if (this.experienceDetails.length > 1) {
      this.experienceDetails.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.expform.valid) {
      this.experienceService.saveExperienceData(this.expform.value);
      alert('Experience details saved successfully!');
    } else {
      alert('Please fill out all required fields.');
    }
  }

  setExperienceData(data: any): void {
    this.experienceDetails.clear();
    data.experienceDetails.forEach((item: any) => {
      this.experienceDetails.push(this.fb.group(item));
    });
  }

  navigateToSkill(): void {
    this.router.navigate(['/profile/skill']);
  }
}