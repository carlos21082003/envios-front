import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoLinea } from './modal-pago-linea';

describe('ModalPagoLinea', () => {
  let component: ModalPagoLinea;
  let fixture: ComponentFixture<ModalPagoLinea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPagoLinea],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalPagoLinea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
