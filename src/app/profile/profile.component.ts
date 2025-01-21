import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators } from '@angular/forms';
import { PersonalService } from '../services/personal.service'



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {


  // constructor(private router: Router, private http: HttpClient) {}
  // logout() {
  //   const confirmation = confirm('Are you sure you want to log out?');
  //   if (confirmation) {
  //     this.http.post<{ success: boolean; message: string }>(
  //       'http://localhost/Angular_Php/logout.php',
  //       {}, // No payload required
  //       { headers: { 'Content-Type': 'application/json' } }
  //     ).subscribe(
  //       (response) => {
  //         if (response.success) {
  //           console.log('Logout Successful:', response.message);
  //           alert(response.message);

  //           // Clear backend session and redirect to login
  //           sessionStorage.clear();
  //           this.router.navigate(['/login']);
  //         } else {
  //           console.log('Logout Failed:', response.message);
  //           alert('Failed to logout. Please try again.');
  //         }
  //       },
  //       (error) => {
  //         console.error('Logout Error:', error);
  //         alert('An error occurred while logging out. Please try again.');
  //       }
  //     );
  //   }
  // }  import { Component } from '@angular/core';

 
    loggedInUser: any; // Holds the current logged-in user details
    personalDetails: any = null; // Holds personal details data
  
    constructor(private router: Router, private personalService: PersonalService) {
      // Retrieve the logged-in user from sessionStorage
      const user = sessionStorage.getItem('loggedInUser');
      this.loggedInUser = user ? JSON.parse(user) : null;
  
      // If a new user logs in, reset existing data
      const previousUser = sessionStorage.getItem('previousUser');
      if (previousUser && previousUser !== this.loggedInUser?.email) {
        // Clear sessionStorage data if a new user logs in
        sessionStorage.clear();
        this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser')!); // Reinitialize logged-in user
      }
  
      // Save the current user as the previous user for the next login check
      sessionStorage.setItem('previousUser', this.loggedInUser?.email || '');
    }
  
    ngOnInit(): void {
      // Fetch personal data for the current user from sessionStorage or PersonalService
      if (this.loggedInUser) {
        const storedData = sessionStorage.getItem(`personalDetails_${this.loggedInUser.email}`);
        if (storedData) {
          // Load personal details from sessionStorage
          this.personalDetails = JSON.parse(storedData);
        } else {
          // Subscribe to PersonalService to get personal details
          this.personalService.personalData$.subscribe((data) => {
            this.personalDetails = data;
  
            // Save the personal details to sessionStorage for the logged-in user
            sessionStorage.setItem(`personalDetails_${this.loggedInUser.email}`, JSON.stringify(data));
          });
        }
      }
    }
  
    logout(): void {
      // Clear session data and navigate to login page
      sessionStorage.removeItem('loggedInUser');
      alert('You have been logged out.');
      sessionStorage.clear(); // Clear all data in sessionStorage
      this.router.navigate(['/login']);
    }
  }