import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Player} from '../../../dashboard/chat/chat.model';
import {MediaDownloadProxyService} from '../../services/media-download-proxy.service';
import {tap} from 'rxjs/operators';
import {MediaDownloadResponse} from '../../services/media.model';
import {MediaBlobImage} from '../../utils/media-blob-image';
import {DomSanitizer} from '@angular/platform-browser';
import {ChatService} from '../../../dashboard/chat/chat.service';

@Component({
  selector: 'app-chat-participants',
  templateUrl: './chat-participants.component.html',
  styleUrls: ['./chat-participants.component.css']
})
export class ChatParticipantsComponent implements OnInit {

  @Input() roomId: string;

  players: Observable<Player[] | any[]>

  constructor(private mediaService: MediaDownloadProxyService,
              private chat: ChatService,
              private sanitizer: DomSanitizer) { }

  ngOnInit() {
    if (!this.roomId) {
      console.error('[ChatParticipantsComponent] Bad context. Specify roomId');
    } else {
      this.players = this.chat.onPresentState(this.roomId).pipe(
        tap((players: Player[]) => {
          players.forEach(p => {
            if (p.avatarId) {
              this.mediaService.downloadMedia(p.avatarId).subscribe((media: MediaDownloadResponse) => {
                p['avatar'] = new MediaBlobImage(this.sanitizer, media.blob, media.name, 32);
              });
            }
          });
        })
      );
    }
  }

}
