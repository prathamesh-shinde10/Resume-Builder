// import { Component ,OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule,FormBuilder,FormArray,FormGroup,Validators } from '@angular/forms';
// import { SkillService } from '../../services/skill.service';

// @Component({
//   selector: 'app-skill',
//   standalone: true,
//   imports: [CommonModule,ReactiveFormsModule],
//   templateUrl: './skill.component.html',
//   styleUrl: './skill.component.css'
// })
// export class SkillComponent implements OnInit {
//   skillForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private skillService: SkillService // Inject the SkillService
//   ) {
//     // Initialize the form group
//     this.skillForm = this.fb.group({
//       skillDetails: this.fb.array([]), // Initialize an empty FormArray
//     });
//   }

//   ngOnInit(): void {
//     // Load skills using SkillService
//     const savedSkills = this.skillService.getSkills();
//     if (savedSkills.length > 0) {
//       savedSkills.forEach((skill) => this.addSkill(skill));
//     } else {
//       this.addSkill(); // Add a default skill row if no data is found
//     }
//   }

//   // Getter for the 'skillDetails' FormArray
//   get skillDetails(): FormArray {
//     return this.skillForm.get('skillDetails') as FormArray;
//   }

//   // Add a new skill row
//   addSkill(skillData: any = { skill: '', per: '' }): void {
//     const skillGroup = this.fb.group({
//       skill: [skillData.skill, Validators.required],
//       per: [
//         skillData.per,
//         [Validators.required, Validators.min(0), Validators.max(100)],
//       ],
//     });
//     this.skillDetails.push(skillGroup);
//   }

//   // // Remove a skill row
//   // removeSkill(index: number): void {
//   //   if (this.skillDetails.length > 1) {
//   //     this.skillDetails.removeAt(index);
//   //   }
//   // }

//   // Save skills using SkillService
//   saveSkills(): void {
//     const skillsData = this.skillForm.value.skillDetails;
//     this.skillService.saveSkills(skillsData); // Save data using the service
//     alert('Skills saved successfully!');
//   }

//   // Handle form submission
//   onSubmit(): void {
//     if (this.skillForm.valid) {
//       this.saveSkills();
//       console.log(this.skillForm.value); // Log the form data to the console
//     } else {
//       alert('Please fill out all required fields correctly!');
//     }
//   }

//   // Navigate to the next page
//   navigateToTemp(): void {
//     this.router.navigate(['/profile/temp']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';


interface Skill {
  _id: string;
  skill: string;
  per: number;
}


@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.css'
})
export class SkillComponent implements OnInit {

  skillForm: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private skillService: SkillService
  ) {
    this.skillForm = this.fb.group({
      skillDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      console.warn('⚠️ No user logged in.');
      return;
    }

    this.loadSkills();
  }

  private loadSkills(): void {
    this.skillService.getSkillsByUserId(this.userId!).subscribe({
      next: (response: any) => {
        console.log(' Fetched Skills:', response);
        let savedSkills = response?.skills || [];

        this.skillDetails.clear(); // Clear existing skills in form

        // If skills exist, add them; otherwise, add an empty row
        if (Array.isArray(savedSkills) && savedSkills.length > 0) {
          savedSkills.forEach((skill) => this.addSkill(skill));
        } else {
          this.addSkill();
        }
      },
      error: (error) => {
        console.error(' Error fetching skills:', error);
        this.skillDetails.clear();
        this.addSkill(); // Ensure at least one row
      }
    });
}

  

  get skillDetails(): FormArray {
    return this.skillForm.get('skillDetails') as FormArray;
  }

  addSkill(skillData: any = { _id: null, skill: '', per: '' }): void {
    const skillGroup = this.fb.group({
      _id: [skillData._id || null],
      skill: [skillData.skill || '', Validators.required],
      per: [skillData.per || 0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
    this.skillDetails.push(skillGroup);
  }

  removeSkill(index: number): void {
    if (!this.userId) {
      alert('User ID not found!');
      return;
    }

    const skillToDelete = this.skillDetails.at(index).value;

    if (!skillToDelete._id) {
      this.skillDetails.removeAt(index);
      return;
    }

    this.skillService.deleteSkill(skillToDelete._id).subscribe({
      next: () => {
        alert('Skill deleted successfully!');
        this.skillDetails.removeAt(index);
      },
      error: (err) => {
        console.error(' Error deleting skill:', err);
        alert('Error deleting skill.');
      }
    });
  }

  saveSkill(index: number): void {
    if (!this.userId) {
      alert('User ID not found!');
      return;
    }

    const { _id, ...skillData } = this.skillDetails.at(index).value;
    console.log('📌 Sending Skill Data:', skillData);

    this.skillService.saveSkills({ userId: this.userId, skills: [skillData] }).subscribe({
      next: (response) => {
        alert('Skill saved successfully!');
        this.skillDetails.at(index).patchValue({ _id: response.skill._id });
      },
      error: (err) => {
        console.error('❌ Error saving skill:', err);
        alert('Error saving skill.');
      }
    });
  }

  navigateToTemp(): void {
    this.router.navigate(['/profile/temp']);
  }
}
