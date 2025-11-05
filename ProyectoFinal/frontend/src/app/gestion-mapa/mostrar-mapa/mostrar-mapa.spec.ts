import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarMapa } from './mostrar-mapa';

describe('MostrarMapa', () => {
  let component: MostrarMapa;
  let fixture: ComponentFixture<MostrarMapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarMapa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostrarMapa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
