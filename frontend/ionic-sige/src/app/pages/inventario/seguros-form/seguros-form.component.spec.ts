import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SegurosFormComponent } from './seguros-form.component';

describe('SegurosFormComponent', () => {
  let component: SegurosFormComponent;
  let fixture: ComponentFixture<SegurosFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SegurosFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SegurosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
