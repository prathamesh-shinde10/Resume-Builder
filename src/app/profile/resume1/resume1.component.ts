import { Component ,OnInit ,ElementRef,ViewChild } from '@angular/core';
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

  personalData: any;
  educationData: any[] = [];
  summaryData: string = '';
  experienceData: any[] = [];
  skills: { skill: string; per: number }[] = [];

  constructor(
    private personalService: PersonalService,
    private eduService: EduService,
    private summaryService: SummaryService,
    private experienceService: ExperienceService,
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    this.fetchPersonalData();
    this.fetchEducationData();
    this.fetchSummaryData();
    this.fetchExperienceData();
    this.skills = this.skillService.getSkills();

    console.log('Skills Data:', this.skills); // Debugging - Log skills data

  }

  fetchPersonalData(): void {
    this.personalService.personalData$.subscribe((data) => {
      if (data) {
        this.personalData = data;
      } else {
        const savedData = sessionStorage.getItem('personalDetails');
        this.personalData = savedData ? JSON.parse(savedData) : null;
      }
    });
  }

  fetchEducationData(): void {
    this.educationData = this.eduService.loadEducationData() || [];
  }

  fetchSummaryData(): void {
    this.summaryData = this.summaryService.getSummary() || '';
    if (!this.summaryData) {
      this.summaryData = sessionStorage.getItem('summaryData') || '';
    }
  }

  fetchExperienceData(): void {
    const savedData = this.experienceService.getExperienceData();
    if (savedData && savedData.experienceDetails) {
      this.experienceData = savedData.experienceDetails;
    }
  }

  /**
   * Generate and download the resume as a PDF
   */
  downloadPDF(): void {
    const resume = this.resumeElement.nativeElement; // The resume element
    html2canvas(resume, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 paper

      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf'); // Download the PDF
    });
  }
}