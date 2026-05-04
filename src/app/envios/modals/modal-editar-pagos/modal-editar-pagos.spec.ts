import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarPagos } from './modal-editar-pagos';

describe('ModalEditarPagos', () => {
  let component: ModalEditarPagos;
  let fixture: ComponentFixture<ModalEditarPagos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarPagos],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarPagos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
