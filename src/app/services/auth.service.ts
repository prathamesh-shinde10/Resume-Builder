import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(userId: string) {
    localStorage.setItem('userId', userId); // Store userId
  }

  logout() {
    localStorage.removeItem('userId'); // Remove userId on logout
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('userId'); // Check if user is logged in
  }
}
