import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Player} from '../../../chat/chat.model';
import {MediaDownloadProxyService} from '../../../../shared/services/media-download-proxy.service';
import {ChatService} from '../../../chat/chat.service';
import {DomSanitizer} from '@angular/platform-browser';
import {map, tap} from 'rxjs/operators';
import {MediaDownloadResponse} from '../../../../shared/services/media.model';
import {MediaBlobImage} from '../../../../shared/utils/media-blob-image';
import {WebsocketService} from '../../../../shared/services/websocket/websocket.service';
import {GameRoomSummary} from '../../../../shared/services/websocket/game-rooms-manager.model';

@Component({
  selector: 'app-specific-room-participants',
  templateUrl: './specific-room-participants.component.html',
  styleUrls: ['./specific-room-participants.component.css']
})
export class SpecificRoomParticipantsComponent implements OnInit {

  @Input() roomId: string;

  roomName: string;

  players: Observable<Player[] | any[]>

  constructor(private mediaService: MediaDownloadProxyService,
              private chat: ChatService,
              private websocket: WebsocketService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (!this.roomId) {
      console.error('[SpecificRoomParticipantsComponent] Bad context. Specify roomId');
    } else {
      this.websocket.getSocket().once(`${this.roomId}/summary`, (summary: GameRoomSummary) => {
        this.roomName = summary.name;
      });
      this.websocket.getSocket().emit(`${this.roomId}/summary`);
      this.players = this.chat.onPresentState(this.roomId).pipe(
        tap((players: Player[]) => {
          players.forEach(p => {
            if (p.avatarId) {
              this.mediaService.downloadMedia(p.avatarId).subscribe((media: MediaDownloadResponse) => {
                p['avatar'] = new MediaBlobImage(this.sanitizer, media.blob, media.name, 32);
              });
            }
          });
        }),
        map((players: Player[]) => players.sort((p1, p2) => p2.points - p1.points))
      );
    }
  }

}
