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
  selector: 'app-resume1',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume1.component.html',
  styleUrl: './resume1.component.css'
})
export class Resume1Component implements OnInit {
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
    this.userId = localStorage.getItem('userId'); // Retrieve userId from storage

    if (this.userId) {
      this.fetchPersonalData();
      this.fetchEducationData();
      this.loadSummary();
      this.fetchExperienceData();
      this.skills = this.skillService.getSkills(); // Load skills
    } else {
      console.warn('No user logged in.');
    }
  }

  fetchPersonalData(): void {
    if (!this.userId) return;

    this.personalService.getPersonalDataById(this.userId).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.personalData = response.data;
          localStorage.setItem('personalDetails', JSON.stringify(this.personalData));
        } else {
          console.warn('No personal data found. Loading from local storage...');
          const savedData = localStorage.getItem('personalDetails');
          this.personalData = savedData ? JSON.parse(savedData) : null;
        }
      },
      error: (err: any) => {
        console.error('Error fetching personal details:', err);
      }
    });
  }

  fetchEducationData(): void {
    if (!this.userId) return;

    this.eduService.loadEducationData(this.userId).subscribe({
      next: (data: any) => {
        this.educationData = data || [];
        console.log('Fetched Education Data:', this.educationData);
      },
      error: (error: any) => {
        console.error('Error fetching education data:', error);
      }
    });
  }

  loadSummary(): void {
    if (!this.userId) return;

    this.summaryService.getLatestSummary(this.userId).subscribe({
      next: (response: any) => {
        console.log('Summary Response:', response);
        this.summaryText = response?.text?.trim() || 'No summary available.';
      },
      error: (error: any) => {
        console.error('Error fetching summary:', error);
        this.summaryText = 'Failed to load summary. Please try again later.';
      }
    });
  }

  fetchExperienceData(): void {
    const savedData = this.experienceService.getExperienceData();
    this.experienceData = savedData?.experienceDetails || [];
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
