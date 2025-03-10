import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  constructor(private router: Router, private http: HttpClient) {}

  // Create a reactive form group for the login form
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
      Validators.minLength(8),
    ]),
  });

  // Navigate to SignUp page
  navigateToSignUp() {
    this.router.navigate(['/sign']);
  }

  login() {
    if (this.loginForm.valid) {
      const loginData = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      };
  
      this.http.post<any>('http://localhost:3000/api/login', loginData, { headers: { 'Content-Type': 'application/json' } })
        .subscribe({
          next: (response) => {
            alert(response.message);
            
            // Store userId and user details in localStorage
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.name);
  
            this.router.navigate(['/profile']); // Navigate to profile page
          },
          error: (err) => {
            console.error('Login error:', err);
            alert(err.error?.message || 'Login failed. Please try again.');
          },
        });
    } else {
      alert('Please fill in the form correctly before submitting.');
    }
  
    this.loginForm.reset();
  }
  
}






//   // Handle login form submission
//   login() {
//     if (this.loginForm.valid) {
//       const loginData = {
//         email: this.loginForm.value.email!,
//         password: this.loginForm.value.password!,
//       };

//       // Fetch users from db.json using HTTP GET
//       this.http.get<any[]>('http://localhost:3000/users').subscribe({
//         next: (users) => {
//           // Check if user exists and password matches
//           const user = users.find((u) => u.email === loginData.email);

//           if (user && user.pass === loginData.password) {
//             alert('Login successful!');
//             sessionStorage.setItem('loggedInUser', JSON.stringify(user)); // Optionally store logged-in user
//             this.router.navigate(['/profile']); // Navigate to profile page
//           } else {
//             alert('Invalid email or password. Please try again.');
//           }
//         },
//         error: (err) => {
//           console.error('Error fetching users:', err);
//           alert('Failed to connect to the database. Please try again later.');
//         },
//       });
//     } else {
//       alert('Please fill in the form correctly before submitting.');
//     }

//     this.loginForm.reset();
//   }
