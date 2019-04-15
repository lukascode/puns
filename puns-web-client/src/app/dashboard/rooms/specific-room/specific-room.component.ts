import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WebsocketService} from '../../../shared/services/websocket/websocket.service';
import {GameRoomService} from './game-room.service';
import * as moment from 'moment';
import {Player} from '../../chat/chat.model';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-specific-room',
  templateUrl: './specific-room.component.html',
  styleUrls: ['./specific-room.component.css']
})
export class SpecificRoomComponent implements OnInit, OnDestroy {

  private sub;
  roomId: string;
  exists = false;

  gameplay = false;
  gameTime = 0;
  currentPlayerTurn = false;
  currentWord = null;
  turn: Player = null;
  notificationText: string = null;
  private gameTimeInterval;

  private onYourTurnSub;

  private onStartRoundDetailsSub;

  private onEndRoundDetailsSub;

  private onYouAreWinnerSub;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private websocket: WebsocketService,
              private gameRoomService: GameRoomService,
              private alertService: AlertService
              ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
      this.websocket.getSocket().emit('game-rooms/exists', this.roomId);
      this.websocket.getSocket().once('game-rooms/exists', response => {
        if (response.roomId === this.roomId && response.exists) {
          this.exists = true;

          this.initGameBeforeRound();
          this.notificationText = 'Oczekiwanie na kolejną rundę...';

          if (this.onYourTurnSub) {
            this.onYourTurnSub.unsubscribe();
          }
          this.onYourTurnSub = this.gameRoomService.onYourTurn(this.roomId).subscribe(details => {
            this.gameplay = true;
            this.gameTime = this.getTimeLeft(details.roundStartedAt, details.time);
            this.currentPlayerTurn = true;
            this.currentWord = details.word;
            this.turn = details.turn;
            this.startTime();
            this.notificationText = 'Runda trwa. Spróbuj jak najlepiej przedstawić hasło za pomocą rysunku';
          });

          if (this.onStartRoundDetailsSub) {
            this.onStartRoundDetailsSub.unsubscribe();
          }
          this.onStartRoundDetailsSub = this.gameRoomService.onStartRoundDetails(this.roomId).subscribe(details => {
            this.gameplay = true;
            this.gameTime = this.getTimeLeft(details.roundStartedAt, details.time);
            this.turn = details.turn;
            this.startTime();
            this.notificationText = 'Runda trwa. Spróbuj jak najszybciej odgadnąć hasło i napisz na czacie';
          });

          if (this.onYouAreWinnerSub) {
            this.onYouAreWinnerSub.unsubscribe();
          }
          this.onYouAreWinnerSub = this.gameRoomService.onYouAreWinner(this.roomId).subscribe(() => {
            this.alertService.success('Brawo, wygrałeś tę rundę');
          });

          if (this.onEndRoundDetailsSub) {
            this.onEndRoundDetailsSub.unsubscribe();
          }
          this.onEndRoundDetailsSub = this.gameRoomService.onEndRoundDetails(this.roomId).subscribe(details => {
            this.initGameBeforeRound();
            if (details.winner) {
              this.notificationText = `Runda zakończona. Rundę wygrywa <strong>${details.winner.nick}</strong>, który odgadł hasło <strong>${details.word}</strong>`;
            } else {
              this.notificationText = `Runda zakończona. Nikt nie odgadł hasła <strong>${details.word}</strong>`;
            }
            setTimeout(() => {
              if (!this.gameplay) {
                this.notificationText = 'Oczekiwanie na kolejną rundę...';
              }
            }, 5000);
          });

        } else {
          this.exists = false;
          this.router.navigate(['404']);
        }
      });
    });
  }

  initGameBeforeRound() {
    this.gameplay = false;
    this.gameTime = 0;
    this.currentPlayerTurn = false;
    this.currentWord = null;
    this.turn = null;
    if (this.gameTimeInterval) {
      clearInterval(this.gameTimeInterval);
    }
  }

  get gameTimeDuration() {
    const duration = moment.duration(this.gameTime, 'seconds');
    return `${duration.minutes()}:${duration.seconds()}`;
  }

  startTime() {
    if (this.gameTimeInterval) {
      clearInterval(this.gameTimeInterval);
    }
    this.gameTimeInterval = setInterval(() => {
      if (this.gameTime && this.gameTime > 0) {
        this.gameTime -= 1;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.onStartRoundDetailsSub) {
      this.onStartRoundDetailsSub.unsubscribe();
    }
    if (this.onYourTurnSub) {
      this.onYourTurnSub.unsubscribe();
    }
    if (this.onEndRoundDetailsSub) {
      this.onEndRoundDetailsSub.unsubscribe();
    }
    if (this.onYouAreWinnerSub) {
      this.onYouAreWinnerSub.unsubscribe();
    }
    if (this.gameTimeInterval) {
      clearInterval(this.gameTimeInterval);
    }
  }

  private getTimeLeft(roundStartedAt, roundTime: number) {
    const seconds = moment.duration(moment().diff(moment(roundStartedAt))).asSeconds();
    return roundTime - seconds;
  }

}
