import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utils} from '../../../shared/utils/utils';
import {GameRoomsManagerService} from '../../../shared/services/websocket/game-rooms-manager.service';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.css']
})
export class CreateRoomDialogComponent implements OnInit {

  form: FormGroup = null;

  static create(dialog: MatDialog): MatDialogRef<CreateRoomDialogComponent> {
    return dialog.open(CreateRoomDialogComponent, {
      width: '36vw'
    });
  }

  constructor(public dialogRef: MatDialogRef<CreateRoomDialogComponent>, private gameRoomsManager: GameRoomsManagerService, fb: FormBuilder) {
    this.form = fb.group({
      roomName: ['', [Validators.required, Validators.maxLength(64)]]
    });
  }

  ngOnInit() {
  }

  createRoom() {
    if (this.form.valid) {
      this.gameRoomsManager.createRoom(this.form.value.roomName.trim());
      this.dialogRef.close();
    } else {
      Utils.markAllTouched(this.form);
    }
  }

}
