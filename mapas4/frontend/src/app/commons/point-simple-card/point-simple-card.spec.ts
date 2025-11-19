import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkbookSimpleCard } from './point-simple-card';

describe('MarkbookSimpleCard', () => {
  let component: MarkbookSimpleCard;
  let fixture: ComponentFixture<MarkbookSimpleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkbookSimpleCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkbookSimpleCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
