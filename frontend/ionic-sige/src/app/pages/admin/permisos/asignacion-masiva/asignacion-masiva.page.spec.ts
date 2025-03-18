import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignacionMasivaPage } from './asignacion-masiva.page';

describe('AsignacionMasivaPage', () => {
  let component: AsignacionMasivaPage;
  let fixture: ComponentFixture<AsignacionMasivaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionMasivaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
