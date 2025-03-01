import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormControl,FormsModule,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


interface SignupResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css',
})


export class SignComponent {

  msg = '';
  
  signupform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    mob: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]{10}'),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    ]),
    pass: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ),
      Validators.minLength(8),
    ]),
  });

  constructor(private http: HttpClient, private router: Router) {}

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  
  
  Submit() {
    const info = {
      name: this.signupform.value.name,
      mob: this.signupform.value.mob,
      email: this.signupform.value.email,
      pass: this.signupform.value.pass,
    };
  
    this.http.post<any>('http://localhost:3000/api/signup', info, { headers: { 'Content-Type': 'application/json' } })
      .subscribe({
        next: (response) => {
          if (response.success) {
            alert('Registration successful!');
            
            // Store userId in localStorage
            localStorage.setItem('userId', response.userId);
            
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Error:', err);
          if (err.status === 400 && err.error?.message === 'User with this email already exists!') {
            alert('User already exists! Please use a different email.');
          } else {
            alert('An error occurred while saving user data.');
          }
        },
      });
  
    this.signupform.reset();
  }

  
  
  }
  





  // msg = "";
  // constructor(private router: Router, private h: HttpClient) {}
  // navigateToLogin() {
  //   this.router.navigate(['/login']);
  // }
  // signupform = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  //   mob: new FormControl('', [Validators.required, Validators.pattern('[0-9]{10}'), Validators.maxLength(10)]),
  //   email: new FormControl('', [
  //     Validators.required,
  //     Validators.email,
  //     Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
  //   ]),
  //   pass: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  //     Validators.minLength(8)
  //   ])
  // });

  // Submit() {
  //   const info = {
  //     name: this.signupform.value.name,
  //     mob: this.signupform.value.mob,
  //     email: this.signupform.value.email,
  //     pass: this.signupform.value.pass
  //   };

  //   this.h.post('http://localhost/Angular_Php/sign_in.php', info).subscribe(
  //     (response: any) => {
  //       if (response.success) {
  //         this.msg = response.message;
  //         alert(this.msg);
  //         this.router.navigate(['/login']); // Navigate to login page after successful registration
  //       } else {
  //         this.msg = response.message;
  //         alert(this.msg);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //       alert('Error occurred during registration. Please try again.');
  //     }
  //   );
  //   this.signupform.reset();
  // }

  // msg = '';
  // signupform = new FormGroup({
  //   name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  //   mob: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern('[0-9]{10}'),
  //     Validators.maxLength(10),
  //   ]),
  //   email: new FormControl('', [
  //     Validators.required,
  //     Validators.email,
  //     Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
  //   ]),
  //   pass: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(
  //       /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  //     ),
  //     Validators.minLength(8),
  //   ]),
  // });

  // constructor(private http: HttpClient, private router: Router) {}

  // navigateToLogin(){
  //   this.router.navigate(['/login']);
  // }

  // Submit() {
  //   const info = {
  //     name: this.signupform.value.name,
  //     mob: this.signupform.value.mob,
  //     email: this.signupform.value.email,
  //     pass: this.signupform.value.pass,
  //   };
  
  //   // Check if email exists in the database
  //   this.http.get<any[]>('http://localhost:3000/users').subscribe({
  //     next: (users) => {
  //       const emailExists = users.some((user) => user.email === info.email);
  
  //       if (emailExists) {
  //         this.msg = 'User with this email already exists!';
  //         alert(this.msg);
  //       } else {
  //         // Add new user to the database
  //         this.http.post('http://localhost:3000/users', info).subscribe({
  //           next: () => {
  //             this.msg = 'Registration successful!';
  //             alert(this.msg);
  //             this.router.navigate(['/login']);
  //           },
  //           error: (err) => {
  //             console.error('Error adding user:', err);
  //             alert('An error occurred while saving user data.');
  //           },
  //         });
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching users:', err);
  //       alert('Failed to connect to the database. Please try again later.');
  //     },
  //   });
  
  //   this.signupform.reset();
  // }
