import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudUsuario } from './solicitud-usuario';

describe('SolicitudUsuario', () => {
  let component: SolicitudUsuario;
  let fixture: ComponentFixture<SolicitudUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
