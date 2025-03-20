import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EquiposFormComponent } from './equipos-form.component';

describe('EquiposFormComponent', () => {
  let component: EquiposFormComponent;
  let fixture: ComponentFixture<EquiposFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EquiposFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EquiposFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
