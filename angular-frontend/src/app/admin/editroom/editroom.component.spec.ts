import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditroomComponent } from './editroom.component';

describe('EditroomComponent', () => {
  let component: EditroomComponent;
  let fixture: ComponentFixture<EditroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditroomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
