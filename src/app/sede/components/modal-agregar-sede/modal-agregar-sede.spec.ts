import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarSede } from './modal-agregar-sede';

describe('ModalAgregarSede', () => {
  let component: ModalAgregarSede;
  let fixture: ComponentFixture<ModalAgregarSede>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarSede],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAgregarSede);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
