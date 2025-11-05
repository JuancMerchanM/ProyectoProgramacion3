import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMarcadores } from './mostrar-marcadores';

describe('MostrarMarcadores', () => {
  let component: MostrarMarcadores;
  let fixture: ComponentFixture<MostrarMarcadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarMarcadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarMarcadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
