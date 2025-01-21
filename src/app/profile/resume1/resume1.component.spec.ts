import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resume1Component } from './resume1.component';

describe('Resume1Component', () => {
  let component: Resume1Component;
  let fixture: ComponentFixture<Resume1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resume1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Resume1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
