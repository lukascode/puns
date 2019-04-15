import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Message, Player} from '../../../dashboard/chat/chat.model';
import {Observable, Subject} from 'rxjs';
import {filter, map, throttleTime} from 'rxjs/operators';
import {MediaBlobImage} from '../../utils/media-blob-image';
import {MediaDownloadProxyService} from '../../services/media-download-proxy.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaDownloadResponse, MediaUploadResponse} from '../../services/media.model';
import {MediaService} from '../../services/media.service';
import {HttpResponse} from '@angular/common/http';
import {ChatService} from '../../../dashboard/chat/chat.service';
import {WebsocketService} from '../../services/websocket/websocket.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() roomId: string;

  @ViewChild('chatConversation') chatConversationContainer: ElementRef;

  messages: Message[];

  textMessage: string;

  notificationText: string = null;

  keyUp = new Subject<any>();

  optionalMediaFileInMessage: File = null;

  private onPlayerDetailsReceivedSub;

  private getAllMessagesSub;

  private keyUpSub;

  private onMessageSub;

  private onPlayerJoinedSub;

  private onPlayerLeftSub;

  private onTypingSub;

  private chatNotifications: string[] = [];

  private chatNotificationInterval;

  constructor(private mediaProxyService: MediaDownloadProxyService,
              private mediaService: MediaService,
              private chat: ChatService,
              private websocket: WebsocketService,
              private sanitizer: DomSanitizer) {
    this.chatNotificationInterval = setInterval(() => {
      if (this.chatNotifications.length > 0) {
        this.notificationText = this.chatNotifications.shift();
      } else {
        this.notificationText = null;
      }
    }, 2000);
  }

  ngOnInit() {

    if (!this.roomId) {
      console.error('[ChatComponent] Bad context. Specify roomId');
      return;
    }

    this.onPlayerDetailsReceivedSub = this.websocket.onPlayerDetailsReceived().subscribe(() => {
      this.chat.join(this.roomId);

      if (this.getAllMessagesSub) {
        this.getAllMessagesSub.unsubscribe();
      }

      this.getAllMessagesSub = this.chat.getAllMessages(this.roomId).subscribe((messages: Message[]) => {
        messages.forEach(m => this.formatMessage(m));
        for (let i = 0; i < messages.length; ++i) {
          if (i === 0) {
            messages[i]['right'] = true;
          } else {
            if (messages[i].playerId === messages[i - 1].playerId) {
              messages[i]['right'] = messages[i - 1]['right'];
            } else {
              messages[i]['right'] = !messages[i - 1]['right'];
            }
          }
        }
        this.messages = messages;

        if (this.onMessageSub) {
          this.onMessageSub.unsubscribe();
        }
        this.onMessageSub = this.chat.onMessage(this.roomId).subscribe((message: Message) => {
          this.formatMessage(message);
          if (this.messages.length > 0) {
            if (this.messages[this.messages.length - 1].playerId === message.playerId) {
              message['right'] = this.messages[this.messages.length - 1]['right'];
            } else {
              message['right'] = !this.messages[this.messages.length - 1]['right'];
            }
          } else {
            message['right'] = true;
          }
          this.messages.push(message);
          this.scrollToBottom();
        });

        if (this.onPlayerJoinedSub) {
          this.onPlayerJoinedSub.unsubscribe();
        }
        this.onPlayerJoinedSub = this.chat.onPlayerJoined(this.roomId).subscribe((player: Player) => {
          this.chatNotifications.push(`Do pokoju dołączył ${player.nick}`);
        });

        if (this.onPlayerLeftSub) {
          this.onPlayerLeftSub.unsubscribe();
        }
        this.onPlayerLeftSub = this.chat.onPlayerLeft(this.roomId).subscribe((player: Player) => {
          this.chatNotifications.push(`${player.nick} wyszedł z pokoju`);
        });

        if (this.onTypingSub) {
          this.onTypingSub.unsubscribe();
        }
        this.onTypingSub = this.chat.onTyping(this.roomId).subscribe((player: Player) => {
          this.chatNotifications.push(`${player.nick} teraz pisze...`);
        });

        if (this.keyUpSub) {
          this.keyUpSub.unsubscribe();
        }
        this.keyUpSub = this.keyUp.pipe(
          filter((event: KeyboardEvent) => event.keyCode !== 13),
          throttleTime(2000)
        ).subscribe(() => {
          this.chat.typing(this.roomId);
        });

        this.scrollToBottom();
      });


    });

    document.getElementById('msg').onkeypress = function(ev) {
      if (ev.keyCode === 13) {
        ev.preventDefault();
      }
    };
  }

  ngOnDestroy() {
    if (this.onPlayerDetailsReceivedSub) {
      this.onPlayerDetailsReceivedSub.unsubscribe();
    }
    if (this.onMessageSub) {
      this.onMessageSub.unsubscribe();
    }
    if (this.onPlayerJoinedSub) {
      this.onPlayerJoinedSub.unsubscribe();
    }
    if (this.onPlayerLeftSub) {
      this.onPlayerLeftSub.unsubscribe();
    }
    if (this.keyUpSub) {
      this.keyUpSub.unsubscribe();
    }
    if (this.getAllMessagesSub) {
      this.getAllMessagesSub.unsubscribe();
    }
    this.chat.leave(this.roomId);
    clearInterval(this.chatNotificationInterval);
  }

  sendMessage() {
    if (this.optionalMediaFileInMessage) {
      this.mediaService.uploadMedia(this.optionalMediaFileInMessage).subscribe(ev => {
        if (ev instanceof HttpResponse) {
          const response: MediaUploadResponse = ev.body;
          this._sendMessage(response.resourceId);
        }
      });
    } else {
      this._sendMessage(null);
    }
  }

  private _sendMessage(mediaId) {
    if (this.textMessage) {
      const msg = this.textMessage.trim();
      if (msg.length > 0) {
        this.chat.publishMessage(this.roomId, msg, mediaId);
      } else if (mediaId) {
        this.chat.publishMessage(this.roomId, '', mediaId);
      }
    } else if (mediaId) {
      this.chat.publishMessage(this.roomId, '', mediaId);
    }
    this.optionalMediaFileInMessage = null;
    this.textMessage = '';
  }

  onFileChanged(event) {
    if (event.target.files.length > 0) {
      this.optionalMediaFileInMessage = event.target.files[0];
    }
  }

  removeFile() {
    this.optionalMediaFileInMessage = null;
    document.getElementById('file-input')['value'] = '';
  }

  private formatMessage(m: Message) {
    m.sendingTime = moment(m.sendingTime).format('DD MMMM YYYY HH:mm:ss');
    if (m.avatarId) {
      this.getAvatar(m.avatarId).subscribe(avatar => {
        m['avatar'] = avatar;
      });
    } else {
      m['avatar'] = null;
    }
    if (m.mediaId) {
      this.mediaService.downloadMedia(m.mediaId).subscribe((media: MediaDownloadResponse) => {
        if (media.blob.type.startsWith('image')) {
          const width = document.getElementById('chat-container').offsetWidth;
          m['mediaImage'] = new MediaBlobImage(this.sanitizer, media.blob, media.name, width * 0.7);
        } else {
          let url: any = URL.createObjectURL(media.blob);
          url = this.sanitizer.bypassSecurityTrustUrl(url);
          m['mediaUrl'] = url;
          m['mediaName'] = media.name;
        }
        this.scrollToBottom();
      });
    }
  }

  private getAvatar(uuid: string): Observable<MediaBlobImage> {
    return this.mediaProxyService.downloadMedia(uuid).pipe(
      map((response: MediaDownloadResponse) => new MediaBlobImage(this.sanitizer, response.blob, response.name, 32))
    );
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.chatConversationContainer.nativeElement.scrollTop = this.chatConversationContainer.nativeElement.scrollHeight;
    }, 100);
  }

}
