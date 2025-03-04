import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PersonalService } from '../../services/personal.service';
import { EduService } from '../../services/edu.service';
import { ExperienceService } from '../../services/experience.service';
import { SkillService } from '../../services/skill.service';
import { SummaryService } from '../../services/summary.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume2.component.html',
  styleUrl: './resume2.component.css'
})
export class Resume2Component implements OnInit {
  
  @ViewChild('resume', { static: false }) resumeElement!: ElementRef;

  personalData: any = null;
  educationData: any[] = [];
  experienceData: any[] = [];
  skills: { skill: string; per: number }[] = [];
  summaryText: string = 'No summary available.';
  userId: string | null = null;

  constructor(
    private personalService: PersonalService,
    private eduService: EduService,
    private summaryService: SummaryService,
    private experienceService: ExperienceService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId'); // Retrieve userId

    if (!this.userId) {
      console.warn('⚠️ No user logged in.');
      return;
    }

    console.log('✅ User ID:', this.userId);
    this.loadUserData();
  }

  /**
   * Fetch all user-related data (personal, education, experience, skills, summary)
   */
  private loadUserData(): void {
    this.fetchPersonalData();
    this.fetchEducationData();
    this.fetchExperienceData();
    this.fetchSkillData();
    this.loadSummary();
  }

  /**
   * Fetch personal details from the backend or local storage
   */
  private fetchPersonalData(): void {
    if (!this.userId) return;

    this.personalService.getPersonalDataById(this.userId).subscribe({
      next: (response) => {
        if (response?.success && response.data) {
          this.personalData = response.data;
          localStorage.setItem('personalDetails', JSON.stringify(this.personalData));
        } else {
          console.warn('⚠️ No personal data found, loading from local storage.');
          this.personalData = JSON.parse(localStorage.getItem('personalDetails') || 'null');
        }
      },
      error: (err) => console.error('❌ Error fetching personal details:', err)
    });
  }

  /**
   * Fetch education details from the backend
   */
  private fetchEducationData(): void {
    if (!this.userId) return;

    this.eduService.loadEducationData(this.userId).subscribe({
      next: (data) => {
        this.educationData = data || [];
        console.log('📚 Education Data:', this.educationData);
      },
      error: (error) => console.error('❌ Error fetching education data:', error)
    });
  }

  /**
   * Fetch experience details from the backend
   */
  private fetchExperienceData(): void {
    if (!this.userId) return;

    this.experienceService.getExperienceData(this.userId).subscribe({
      next: (response) => {
        console.log('📡 Experience Data:', response);
        this.experienceData = response?.experienceDetails || response || [];
      },
      error: (error) => console.error('❌ Error fetching experience data:', error)
    });
  }

  /**
   * Fetch skills data from the backend
   */
  private fetchSkillData(): void {
    if (!this.userId) return;
  
    this.skillService.getSkillsByUserId(this.userId).subscribe({
      next: (response: any) => { // Explicitly define response type
        console.log('🛠️ Skills Data:', response);
  
        if (Array.isArray(response)) {
          this.skills = response; // Directly assign the array
        } else if (response && typeof response === 'object' && 'skills' in response && Array.isArray(response.skills)) {
          this.skills = response.skills; // Extract skills if wrapped inside an object
        } else {
          this.skills = []; // Default to an empty array
        }
      },
      error: (error) => {
        console.error('❌ Error fetching skills:', error);
        this.skills = []; // Ensure skills is always an array
      }
    });
  }
  
  /**
   * Load the latest summary from the backend
   */
  private loadSummary(): void {
    if (!this.userId) return;

    this.summaryService.getLatestSummary(this.userId).subscribe({
      next: (response) => {
        console.log('📝 Summary Response:', response);
        this.summaryText = response?.text?.trim() || 'No summary available.';
      },
      error: (error) => {
        console.error('❌ Error fetching summary:', error);
        this.summaryText = 'Failed to load summary. Please try again later.';
      }
    });
  }

  /**
   * Generate and download the resume as a PDF
   */
  downloadPDF(): void {
    const resume = this.resumeElement.nativeElement;
    html2canvas(resume, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    });
  }

}