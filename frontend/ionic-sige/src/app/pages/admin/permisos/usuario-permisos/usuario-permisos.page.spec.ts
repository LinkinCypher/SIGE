import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuarioPermisosPage } from './usuario-permisos.page';

describe('UsuarioPermisosPage', () => {
  let component: UsuarioPermisosPage;
  let fixture: ComponentFixture<UsuarioPermisosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioPermisosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
