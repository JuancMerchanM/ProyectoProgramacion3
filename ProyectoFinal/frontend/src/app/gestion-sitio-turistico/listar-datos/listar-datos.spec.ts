import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDatos } from './listar-datos';

describe('ListarDatos', () => {
  let component: ListarDatos;
  let fixture: ComponentFixture<ListarDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDatos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDatos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
