import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristSiteList } from './show-site';

describe('ListarDatos', () => {
  let component: TouristSiteList;
  let fixture: ComponentFixture<TouristSiteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TouristSiteList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TouristSiteList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
