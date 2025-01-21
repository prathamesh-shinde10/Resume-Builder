import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule,FormGroup,FormControl,FormsModule,Validators } from '@angular/forms';
import { PersonalService } from '../../services/personal.service';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.css'
})
export class PersonalComponent implements OnInit {
  personalform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    job: new FormControl('', [Validators.required]),
    add: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    ]),
    mob: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}'), Validators.maxLength(10)]),
    link: new FormControl('', [Validators.required,  Validators.minLength(5)]),
    // photo: new FormControl('', [Validators.required]),
  });

 constructor(private router: Router, private personalService: PersonalService) {}
 navigateToEducation() {
  this.router.navigate(['/profile/edu']);
}
  
  ngOnInit(): void {
    this.loadFormData();
  }

  onSubmit() {
    if (this.personalform.valid) {
      const personalDetails = this.personalform.value;

      // Save form data to session storage
      sessionStorage.setItem('personalDetails', JSON.stringify(personalDetails));

      // Pass the data to PersonalService
      this.personalService.updatePersonalData(personalDetails);

      alert('Personal details saved successfully!');
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  loadFormData() {
    const savedData = sessionStorage.getItem('personalDetails');
    if (savedData) {
      this.personalform.setValue(JSON.parse(savedData));
    }
  }
  clearForm() {
    this.personalform.reset();
    sessionStorage.removeItem('personalDetails');
    alert('Form cleared!');
  }
  
}
