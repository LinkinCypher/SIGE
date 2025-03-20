import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TiposPage } from './tipos.page';

describe('TiposPage', () => {
  let component: TiposPage;
  let fixture: ComponentFixture<TiposPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
