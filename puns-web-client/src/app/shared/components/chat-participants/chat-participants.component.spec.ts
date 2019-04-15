import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatParticipantsComponent } from './chat-participants.component';

describe('ChatParticipantsComponent', () => {
  let component: ChatParticipantsComponent;
  let fixture: ComponentFixture<ChatParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
