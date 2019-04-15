import {Component, OnInit} from '@angular/core';
import {PlayerAccountService} from '../../player-account/player-account.service';
import {map, tap} from 'rxjs/operators';
import {PlayerSnapshot} from '../../player-account/player-account.model';
import {MediaDownloadProxyService} from '../../../shared/services/media-download-proxy.service';
import {MediaDownloadResponse} from '../../../shared/services/media.model';
import {MediaBlobImage} from '../../../shared/utils/media-blob-image';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  players: PlayerSnapshot[];

  displayedColumns = ['avatar', 'nick', 'pointsSum'];

  constructor(private playerAccountService: PlayerAccountService,
              private mediaService: MediaDownloadProxyService,
              private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.playerAccountService.getAllPlayers().pipe(
      tap(players => {
        for (const player of players) {
          let sum = 0;
          for (const score of player.scores) {
            sum += score.points;
          }
          player['pointsSum'] = sum;
        }
      }),
      tap(players => {
        for (const player of players) {
          if (player.avatarId) {
            this.mediaService.downloadMedia(player.avatarId).subscribe((response: MediaDownloadResponse) => {
                player['avatar'] = new MediaBlobImage(this.sanitizer, response.blob, response.name, 32);
            });
          }
        }
      }),
      map(players => players.sort((p1, p2) => p2['pointsSum'] - p1['pointsSum']))
    ).subscribe(players => {
      this.players = players;
    });
  }

}
