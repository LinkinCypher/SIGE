import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MantenimientosFormComponent } from './mantenimientos-form.component';

describe('MantenimientosFormComponent', () => {
  let component: MantenimientosFormComponent;
  let fixture: ComponentFixture<MantenimientosFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MantenimientosFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
