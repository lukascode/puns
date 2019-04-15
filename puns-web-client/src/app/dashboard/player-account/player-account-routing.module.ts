import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlayerAccountComponent} from './player-account/player-account.component';

const PLAYER_ACCOUNT_ROUTING: Routes = [
  {
    path: '', component: PlayerAccountComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(PLAYER_ACCOUNT_ROUTING)],
  exports: [RouterModule]
})
export class PlayerAccountRoutingModule {}
