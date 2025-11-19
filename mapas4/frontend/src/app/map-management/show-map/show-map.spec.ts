import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMap } from './show-map';

describe('MostrarMapa', () => {
  let component: ShowMap;
  let fixture: ComponentFixture<ShowMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
