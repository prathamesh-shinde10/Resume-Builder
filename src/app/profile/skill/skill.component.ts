import { Component ,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormArray,FormGroup,Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.css'
})
export class SkillComponent implements OnInit {
  skillForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private skillService: SkillService // Inject the SkillService
  ) {
    // Initialize the form group
    this.skillForm = this.fb.group({
      skillDetails: this.fb.array([]), // Initialize an empty FormArray
    });
  }

  ngOnInit(): void {
    // Load skills using SkillService
    const savedSkills = this.skillService.getSkills();
    if (savedSkills.length > 0) {
      savedSkills.forEach((skill) => this.addSkill(skill));
    } else {
      this.addSkill(); // Add a default skill row if no data is found
    }
  }

  // Getter for the 'skillDetails' FormArray
  get skillDetails(): FormArray {
    return this.skillForm.get('skillDetails') as FormArray;
  }

  // Add a new skill row
  addSkill(skillData: any = { skill: '', per: '' }): void {
    const skillGroup = this.fb.group({
      skill: [skillData.skill, Validators.required],
      per: [
        skillData.per,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
    this.skillDetails.push(skillGroup);
  }

  // // Remove a skill row
  // removeSkill(index: number): void {
  //   if (this.skillDetails.length > 1) {
  //     this.skillDetails.removeAt(index);
  //   }
  // }

  // Save skills using SkillService
  saveSkills(): void {
    const skillsData = this.skillForm.value.skillDetails;
    this.skillService.saveSkills(skillsData); // Save data using the service
    alert('Skills saved successfully!');
  }

  // Handle form submission
  onSubmit(): void {
    if (this.skillForm.valid) {
      this.saveSkills();
      console.log(this.skillForm.value); // Log the form data to the console
    } else {
      alert('Please fill out all required fields correctly!');
    }
  }

  // Navigate to the next page
  navigateToTemp(): void {
    this.router.navigate(['/profile/temp']);
  }
}