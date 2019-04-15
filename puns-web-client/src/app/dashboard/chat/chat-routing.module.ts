import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChatComponent} from './chat/chat.component';
import {GlobalComponent} from './global/global.component';

const CHAT_ROUTING: Routes = [
  {
    path: '', component: ChatComponent, children: [
      { path: '', component: GlobalComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(CHAT_ROUTING)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
