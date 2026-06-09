import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEnvios } from './mis-envios';

describe('MisEnvios', () => {
  let component: MisEnvios;
  let fixture: ComponentFixture<MisEnvios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisEnvios],
    }).compileComponents();

    fixture = TestBed.createComponent(MisEnvios);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
