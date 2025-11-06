import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoute } from './create-route';

describe('CrearRuta', () => {
  let component: CreateRoute;
  let fixture: ComponentFixture<CreateRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
