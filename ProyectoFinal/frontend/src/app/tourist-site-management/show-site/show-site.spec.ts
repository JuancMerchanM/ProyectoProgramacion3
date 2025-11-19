import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSite } from './show-site';

describe('ListarDatos', () => {
  let component: ShowSite;
  let fixture: ComponentFixture<ShowSite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSite]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
