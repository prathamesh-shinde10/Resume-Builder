import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resume2Component } from './resume2.component';

describe('Resume2Component', () => {
  let component: Resume2Component;
  let fixture: ComponentFixture<Resume2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resume2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Resume2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
