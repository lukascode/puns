import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {LoggerService} from './services/logger.service';
import { ChatComponent } from './components/chat/chat.component';
import {FormsModule} from '@angular/forms';
import { ChatParticipantsComponent } from './components/chat-participants/chat-participants.component';
import { CanvasComponent } from './components/canvas/canvas.component';

export const providers = [
  LoggerService
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    FormsModule
  ],
  declarations: [PageNotFoundComponent, ChatComponent, ChatParticipantsComponent, CanvasComponent],
  exports: [
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    PageNotFoundComponent,
    ChatComponent,
    ChatParticipantsComponent,
    CanvasComponent
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [...providers]
    };
  }
}
