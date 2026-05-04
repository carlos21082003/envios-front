import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarTipoProducto } from './modal-agregar-tipo-producto';

describe('ModalAgregarTipoProducto', () => {
  let component: ModalAgregarTipoProducto;
  let fixture: ComponentFixture<ModalAgregarTipoProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarTipoProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAgregarTipoProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
