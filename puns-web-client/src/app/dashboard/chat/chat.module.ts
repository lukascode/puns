import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { SharedModule } from '../../shared/shared.module';
import { GlobalComponent } from './global/global.component';
import { PrivateComponent } from './private/private.component';
import {ChatRoutingModule} from './chat-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule
  ],
  declarations: [ChatComponent, GlobalComponent, PrivateComponent]
})
export class ChatModule { }
