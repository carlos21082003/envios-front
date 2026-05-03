import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEnvio } from './agregar-envio';

describe('AgregarEnvio', () => {
  let component: AgregarEnvio;
  let fixture: ComponentFixture<AgregarEnvio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarEnvio],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarEnvio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
