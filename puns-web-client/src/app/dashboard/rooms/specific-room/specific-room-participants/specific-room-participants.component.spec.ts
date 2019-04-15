import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificRoomParticipantsComponent } from './specific-room-participants.component';

describe('SpecificRoomParticipantsComponent', () => {
  let component: SpecificRoomParticipantsComponent;
  let fixture: ComponentFixture<SpecificRoomParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificRoomParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificRoomParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
