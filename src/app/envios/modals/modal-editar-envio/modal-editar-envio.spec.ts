import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarEnvio } from './modal-editar-envio';

describe('ModalEditarEnvio', () => {
  let component: ModalEditarEnvio;
  let fixture: ComponentFixture<ModalEditarEnvio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarEnvio],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarEnvio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
