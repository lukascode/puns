import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAccountComponent } from './player-account.component';

describe('PlayerAccountComponent', () => {
  let component: PlayerAccountComponent;
  let fixture: ComponentFixture<PlayerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
