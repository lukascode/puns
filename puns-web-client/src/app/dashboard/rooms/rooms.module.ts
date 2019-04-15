import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms/rooms.component';
import {RoomsRoutingModule} from './rooms-routing.module';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import {SharedModule} from '../../shared/shared.module';
import { CreateRoomDialogComponent } from './create-room-dialog/create-room-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SpecificRoomComponent } from './specific-room/specific-room.component';
import { SpecificRoomParticipantsComponent } from './specific-room/specific-room-participants/specific-room-participants.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RoomsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [RoomsComponent, RoomsListComponent, CreateRoomDialogComponent, SpecificRoomComponent, SpecificRoomParticipantsComponent],
  entryComponents: [
    CreateRoomDialogComponent
  ]
})
export class RoomsModule { }
