import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedButton } from './animated-button';

describe('AnimatedButton', () => {
  let component: AnimatedButton;
  let fixture: ComponentFixture<AnimatedButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
