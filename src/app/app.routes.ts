import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignComponent } from './sign/sign.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PersonalComponent } from './profile/personal/personal.component';
import { EducationComponent } from './profile/education/education.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SummaryComponent } from './profile/summary/summary.component';
import { ExperienceComponent } from './profile/experience/experience.component';
import { SkillComponent } from './profile/skill/skill.component';
import { TemplateComponent } from './profile/template/template.component';
import { Resume1Component } from './profile/resume1/resume1.component';
import { Resume2Component } from './profile/resume2/resume2.component';
import { Resume3Component } from './profile/resume3/resume3.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'sign', component: SignComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'profile',
        canActivate: [authGuard],  // Protects all child routes
        children: [
            { path: '', component: ProfileComponent, canActivate: [authGuard] }, 
            { path: 'personal', component: PersonalComponent, canActivate: [authGuard] },
            { path: 'edu', component: EducationComponent, canActivate: [authGuard] },
            { path: 'summ', component: SummaryComponent, canActivate: [authGuard] },
            { path: 'exp', component: ExperienceComponent, canActivate: [authGuard] },
            { path: 'skill', component: SkillComponent, canActivate: [authGuard] },
            { path: 'temp', component: TemplateComponent, canActivate: [authGuard] },
            { path: 'r1', component: Resume1Component, canActivate: [authGuard] },
            { path: 'r2', component: Resume2Component, canActivate: [authGuard] },
            { path: 'r3', component: Resume3Component, canActivate: [authGuard] },
        ]
    },
    { path: '**', component: PagenotfoundComponent }
];
