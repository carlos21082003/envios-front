import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarTipoProducto } from './modal-eliminar-tipo-producto';

describe('ModalEliminarTipoProducto', () => {
  let component: ModalEliminarTipoProducto;
  let fixture: ComponentFixture<ModalEliminarTipoProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarTipoProducto],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarTipoProducto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
