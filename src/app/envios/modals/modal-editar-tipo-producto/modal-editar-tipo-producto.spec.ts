import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarTipoProducto } from './modal-editar-tipo-producto';

describe('ModalEditarTipoProducto', () => {
  let component: ModalEditarTipoProducto;
  let fixture: ComponentFixture<ModalEditarTipoProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarTipoProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarTipoProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
