import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDesactivarSede } from './modal-desactivar-sede';

describe('ModalDesactivarSede', () => {
  let component: ModalDesactivarSede;
  let fixture: ComponentFixture<ModalDesactivarSede>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDesactivarSede],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDesactivarSede);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
