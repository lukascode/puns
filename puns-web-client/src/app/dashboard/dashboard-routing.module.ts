import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainNavComponent} from './main-nav/main-nav.component';
import {HomeComponent} from './home/home.component';
import {NotAuthenticatedGuardService} from '../security/not-authenticated-guard.service';
import {RoomsComponent} from './rooms/rooms/rooms.component';

const DASHBOARD_ROUTING: Routes = [
  {
    path: '', component: MainNavComponent, canActivateChild: [NotAuthenticatedGuardService], children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      { path: 'rooms', loadChildren: './rooms/rooms.module#RoomsModule'},
      { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsModule'},
      { path: 'chat', loadChildren: './chat/chat.module#ChatModule'},
      { path: 'player-account', loadChildren: './player-account/player-account.module#PlayerAccountModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DASHBOARD_ROUTING)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
