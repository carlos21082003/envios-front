import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitarDelivery } from './modal-solicitar-delivery';

describe('ModalSolicitarDelivery', () => {
  let component: ModalSolicitarDelivery;
  let fixture: ComponentFixture<ModalSolicitarDelivery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSolicitarDelivery],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSolicitarDelivery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
