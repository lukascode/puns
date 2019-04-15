import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerAccountComponent } from './player-account/player-account.component';
import {SharedModule} from '../../shared/shared.module';
import {PlayerAccountRoutingModule} from './player-account-routing.module';
import { ChangePassDialogComponent } from './change-pass-dialog/change-pass-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PlayerAccountRoutingModule
  ],
  declarations: [PlayerAccountComponent, ChangePassDialogComponent],
  entryComponents: [ChangePassDialogComponent]
})
export class PlayerAccountModule { }
