import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarProductos } from './modal-editar-productos';

describe('ModalEditarProductos', () => {
  let component: ModalEditarProductos;
  let fixture: ComponentFixture<ModalEditarProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarProductos],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarProductos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
