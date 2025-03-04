import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] // ✅ Fixed typo (styleUrls instead of styleUrl)
})
export class ProfileComponent implements OnInit {

  loggedInUser: any = null; // Holds the logged-in user details

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Fetching loggedInUser from localStorage...');

    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (userId) {
      this.loggedInUser = { userId, userEmail, userName };
      console.log('Logged-in User:', this.loggedInUser);
    } else {
      console.warn('No user found in localStorage!');
      this.router.navigate(['/login']); // ✅ Redirect to login if no user found
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to log out?')) {
      // ✅ Properly remove user data from localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
  
      this.router.navigate(['/login']).then(() => {
        alert('You have been logged out.'); //  Single alert after navigation
        window.location.reload(); //Force refresh to apply AuthGuard
      });
    }
  
  
  }
}
