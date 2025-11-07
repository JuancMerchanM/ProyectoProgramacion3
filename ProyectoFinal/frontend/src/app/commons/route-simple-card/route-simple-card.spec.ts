import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSimpleCard } from './route-simple-card';

describe('RouteSimpleCard', () => {
  let component: RouteSimpleCard;
  let fixture: ComponentFixture<RouteSimpleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteSimpleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteSimpleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
