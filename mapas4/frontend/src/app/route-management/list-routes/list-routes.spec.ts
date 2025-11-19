import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoutes } from './list-routes';

describe('ListarRutas', () => {
  let component: ListRoutes;
  let fixture: ComponentFixture<ListRoutes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRoutes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRoutes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
