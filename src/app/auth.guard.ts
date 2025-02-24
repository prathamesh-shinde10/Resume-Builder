import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userId = localStorage.getItem('userId'); // Checking if user is logged in

  if (!userId) {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
  return true;
};
