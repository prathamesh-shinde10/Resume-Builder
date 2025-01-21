import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EduService } from '../../services/edu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormGroup,FormControl,FormsModule,Validators,FormArray} from '@angular/forms';
@Component({
  selector: 'app-education',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent implements OnInit {
  // Define the main form group
  eduform = new FormGroup({
    educationDetails: new FormArray([]), // FormArray for dynamic forms
  });

  constructor(private router: Router,private eduService: EduService) {}
  navigateToSummary() {
    this.router.navigate(['/profile/summ']);
  }    



  ngOnInit(): void {
    console.log('Initializing EducationComponent');
    this.loadEducationData();
    if (this.educationDetails.length === 0) {
      this.addForm();
    }
    console.log('Form Array:', this.educationDetails);
  }
  

  // Get for FormArray
  get educationDetails(): FormArray {
    return this.eduform.get('educationDetails') as FormArray;
  }
  

  // Method to add a new education form dynamically
  addForm(): void {
    const newEducationForm = new FormGroup({
      qly: new FormControl('', [Validators.required]), // Qualification
      clg: new FormControl('', [Validators.required]), // College/School Name
      uni: new FormControl('', [Validators.required]), // Board/University Name
      compl: new FormControl('', [Validators.required]), // Completion Year
    });
    this.educationDetails.push(newEducationForm);
  }

  // Save data using the service
  onSubmit(): void {
    if (this.eduform.valid) {
      const educationData = this.educationDetails.value; // Extract only the array of education details
  
      // Save form data to session storage for persistence
      sessionStorage.setItem('educationData', JSON.stringify(educationData));
  
      // Save the education details using the service
      this.eduService.saveEducationData(educationData);
      alert('Education details saved successfully!');
    } else {
      alert('Please fill in all required fields.');
    }
  }
  

  // Load data using the service
  loadEducationData(): void {
    const savedData = this.eduService.loadEducationData();
    if (savedData && savedData.length > 0) {
      savedData.forEach((education: any) => {
        const educationForm = new FormGroup({
          qly: new FormControl(education.qly, [Validators.required]),
          clg: new FormControl(education.clg, [Validators.required]),
          uni: new FormControl(education.uni, [Validators.required]),
          compl: new FormControl(education.compl, [Validators.required]),
        });
        this.educationDetails.push(educationForm);
      });
    } else {
      this.addForm(); // Add a default form if no saved data exists
    }
  }
}