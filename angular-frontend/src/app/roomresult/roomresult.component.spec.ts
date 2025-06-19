import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomresultComponent } from './roomresult.component';

describe('RoomresultComponent', () => {
  let component: RoomresultComponent;
  let fixture: ComponentFixture<RoomresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomresultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
