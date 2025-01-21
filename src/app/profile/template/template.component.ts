import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {
  constructor(private router: Router,) {}
  navigateToR1() {
   this.router.navigate(['/profile/r1']);
 }
 navigateToR2() {
  this.router.navigate(['/profile/r2']);
}
navigateToR3() {
  this.router.navigate(['/profile/r3']);
}
}
