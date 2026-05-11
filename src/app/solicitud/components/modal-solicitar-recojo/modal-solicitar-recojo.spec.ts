import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitarRecojo } from './modal-solicitar-recojo';

describe('ModalSolicitarRecojo', () => {
  let component: ModalSolicitarRecojo;
  let fixture: ComponentFixture<ModalSolicitarRecojo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSolicitarRecojo],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSolicitarRecojo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
