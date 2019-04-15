import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../security/auth.service';
import {AlertService} from 'ngx-alerts';
import {SessionService} from '../../security/session.service';
import {PlayerAccountService} from '../player-account/player-account.service';
import {MediaBlobImage} from '../../shared/utils/media-blob-image';
import {PlayerSnapshot} from '../player-account/player-account.model';
import {MediaService} from '../../shared/services/media.service';
import {MediaDownloadResponse} from '../../shared/services/media.model';
import {DomSanitizer} from '@angular/platform-browser';
import {finalize} from 'rxjs/operators';
import {WebsocketService} from '../../shared/services/websocket/websocket.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  currentPlayerAvatar: MediaBlobImage = null;

  currentPlayerAvatarFetchInProgress = false;

  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private session: SessionService,
    private playerAccountService: PlayerAccountService,
    private mediaService: MediaService,
    private sanitizer: DomSanitizer,
    private websocket: WebsocketService,
    ) { }

    ngOnInit() {
      this.playerAccountService.playerAvatarChanged.subscribe(() => this.getCurrentPlayerAvatar());
      this.getCurrentPlayerAvatar();
      this.websocket.connect();
    }

    getCurrentPlayerAvatar() {
      this.playerAccountService.getCurrentPlayer()
        .pipe(
          finalize(() => this.currentPlayerAvatarFetchInProgress = false)
        )
        .subscribe((player: PlayerSnapshot) => {
          this.currentPlayerAvatar = null;
          this.currentPlayerAvatarFetchInProgress = true;
          if (player.avatarId) {
            this.mediaService.downloadMedia(player.avatarId).subscribe((response: MediaDownloadResponse) => {
                this.currentPlayerAvatar = new MediaBlobImage(this.sanitizer, response.blob, response.name, 32);
            });
          }
      });
    }

  logout() {
    this.auth.logout();
    this.alert.info('Wylogowano pomyślnie');
    this.router.navigate(['public/login']);
  }

  currentUserAccount() {
    this.router.navigate(['player-account'], {relativeTo: this.route});
  }

  get nick() {
    return this.session.getNick();
  }

}
