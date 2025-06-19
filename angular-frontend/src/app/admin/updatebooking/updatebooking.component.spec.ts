import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatebookingComponent } from './updatebooking.component';

describe('UpdatebookingComponent', () => {
  let component: UpdatebookingComponent;
  let fixture: ComponentFixture<UpdatebookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatebookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatebookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
