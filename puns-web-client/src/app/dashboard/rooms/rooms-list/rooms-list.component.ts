import {Component, OnDestroy, OnInit} from '@angular/core';
import {CreateRoomDialogComponent} from '../create-room-dialog/create-room-dialog.component';
import {MatDialog} from '@angular/material';
import {GameRoomsManagerService} from '../../../shared/services/websocket/game-rooms-manager.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';
import {WebsocketService} from '../../../shared/services/websocket/websocket.service';
import {AlertService} from 'ngx-alerts';
import {ActivatedRoute, Router} from '@angular/router';

export interface GameRoomElement {
  roomId: string;
  name: string;
  nOfParticipants: number;
}

export class GameRoomsDataSource extends DataSource<GameRoomElement> {

  dataChange: BehaviorSubject<GameRoomElement[]> = new BehaviorSubject<GameRoomElement[]>([]);

  constructor() {
    super();
  }

  connect(): Observable<GameRoomElement[]> {
    return this.dataChange;
  }

  disconnect() {}

  getLength() {
    return this.dataChange.value.length;
  }

}

@Component({
  selector: 'app-rooms-list',
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.css']
})
export class RoomsListComponent implements OnInit, OnDestroy {

  dataSource: GameRoomsDataSource = null;

  displayedColumns = ['name', 'nOfParticipants', 'join', 'delete'];

  private onAllGameRoomsSub;

  private onPlayerDetailsReceivedSub;

  constructor(private dialog: MatDialog,
              private gameRoomsManagerService: GameRoomsManagerService,
              private websocket: WebsocketService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute
              ) { }

  ngOnInit() {
    this.dataSource = new GameRoomsDataSource();
    this.onPlayerDetailsReceivedSub = this.websocket.onPlayerDetailsReceived().subscribe(() => {
      if (this.onAllGameRoomsSub) {
        this.onAllGameRoomsSub.unsubscribe();
      }
      this.onAllGameRoomsSub = this.gameRoomsManagerService.onAllGameRooms()
        .subscribe(response => {
          this.dataSource.dataChange.next(response);
        });
      this.gameRoomsManagerService.getAllRooms();
    });
  }

  ngOnDestroy() {
    if (this.onAllGameRoomsSub) {
      this.onAllGameRoomsSub.unsubscribe();
    }
    if (this.onPlayerDetailsReceivedSub) {
      this.onPlayerDetailsReceivedSub.unsubscribe();
    }
  }

  createRoom() {
    CreateRoomDialogComponent.create(this.dialog);
  }

  joinRoom(roomId) {
    this.router.navigate([roomId], { relativeTo: this.route });
  }

  deleteRoom(room: GameRoomElement) {
    if (room.nOfParticipants === 0) {
      this.gameRoomsManagerService.deleteRoom(room.roomId);
    } else {
      this.alertService.warning('Nie można usunąć pokoju jeśli są w nim gracze');
    }
  }

}
