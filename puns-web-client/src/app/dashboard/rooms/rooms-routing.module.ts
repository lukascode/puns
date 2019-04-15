import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoomsComponent} from './rooms/rooms.component';
import {RoomsListComponent} from './rooms-list/rooms-list.component';
import {SpecificRoomComponent} from './specific-room/specific-room.component';

const ROOMS_ROUTING: Routes = [
  {
    path: '', component: RoomsComponent, children: [
      { path: '', component: RoomsListComponent },
      { path: ':roomId', component: SpecificRoomComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROOMS_ROUTING)],
  exports: [RouterModule]
})
export class RoomsRoutingModule {}
