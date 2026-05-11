import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarEnvioCliente } from './buscar-envio-cliente';

describe('BuscarEnvioCliente', () => {
  let component: BuscarEnvioCliente;
  let fixture: ComponentFixture<BuscarEnvioCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarEnvioCliente],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarEnvioCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
