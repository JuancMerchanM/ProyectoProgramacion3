import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookmarks } from './show-locations';

describe('ShowBookmarks', () => {
  let component: ShowBookmarks;
  let fixture: ComponentFixture<ShowBookmarks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBookmarks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBookmarks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
