import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindbookingComponent } from './findbooking.component';

describe('FindbookingComponent', () => {
  let component: FindbookingComponent;
  let fixture: ComponentFixture<FindbookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindbookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
