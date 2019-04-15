import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ChangePassDialogComponent} from '../change-pass-dialog/change-pass-dialog.component';
import {MediaService} from '../../../shared/services/media.service';
import {AlertService} from 'ngx-alerts';
import {HttpResponse} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaDownloadResponse, MediaUploadResponse} from '../../../shared/services/media.model';
import {MediaBlobImage} from '../../../shared/utils/media-blob-image';
import {PlayerAccountService} from '../player-account.service';
import {PlayerSnapshot} from '../player-account.model';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-player-account',
  templateUrl: './player-account.component.html',
  styleUrls: ['./player-account.component.css']
})
export class PlayerAccountComponent implements OnInit {

  currentPlayer: PlayerSnapshot = null;

  currentPlayerAvatar: MediaBlobImage = null;

  progress = false;

  pointsSum = 0;

  constructor(
    private dialog: MatDialog,
    private mediaService: MediaService,
    private alert: AlertService,
    private sanitizer: DomSanitizer,
    private playerAccountService: PlayerAccountService
    ) { }

  ngOnInit() {
    this.playerAccountService.playerAvatarChanged.subscribe(() => this.getCurrentPlayerData());
    this.getCurrentPlayerData();
  }

  getCurrentPlayerData() {
    this.progress = true;
    this.playerAccountService.getCurrentPlayer()
      .pipe(
        finalize(() => this.progress = false)
      )
      .subscribe((player: PlayerSnapshot) => {
      this.currentPlayer = player;
      this.calculateScoreSum();
      this.currentPlayerAvatar = null;
      if (this.currentPlayer.avatarId) {
        this.mediaService.downloadMedia(this.currentPlayer.avatarId).subscribe((response: MediaDownloadResponse) => {
          this.currentPlayerAvatar = new MediaBlobImage(this.sanitizer, response.blob, response.name, 96);
        });
      }
    });
  }

  calculateScoreSum() {
    let sum = 0;
    for (const score of this.currentPlayer.scores) {
      sum += score.points;
    }
    this.pointsSum = sum;
  }

  changePass() {
    ChangePassDialogComponent.create(this.dialog);
  }

  onAvatarChanged(event) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];

      this.mediaService.uploadMedia(file).subscribe((ev => {
        if (ev instanceof HttpResponse) {
          const response: MediaUploadResponse = ev.body;
          this.playerAccountService.setCurrentPlayerAvatar(response.resourceId).subscribe();
        }
      }));

    }
  }

}
