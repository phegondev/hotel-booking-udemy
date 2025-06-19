import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageroomsComponent } from './managerooms.component';

describe('ManageroomsComponent', () => {
  let component: ManageroomsComponent;
  let fixture: ComponentFixture<ManageroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageroomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
