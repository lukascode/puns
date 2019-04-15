import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePassDialogComponent } from './change-pass-dialog.component';

describe('ChangePassDialogComponent', () => {
  let component: ChangePassDialogComponent;
  let fixture: ComponentFixture<ChangePassDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePassDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePassDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
