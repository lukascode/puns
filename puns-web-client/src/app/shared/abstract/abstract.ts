import {Observable} from 'rxjs';
import {Message, Player} from '../../dashboard/chat/chat.model';
import {NewShapeDetails} from '../components/canvas/canvas-websocket.model';
import {Point2D, Shape} from '../components/canvas/canvas.model';
import {EndRoundDetails, StartRoundDetails, YourTurnDetails} from '../../dashboard/rooms/specific-room/game-room.model';

export class BasicHttpClient {

    protected apiUrl: string;

    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
}

export interface Participants {
  onPresentState(roomId): Observable<Player[] | any[]>;
}


export interface Chat extends Participants {

  join(roomId);

  leave(roomId);

  getAllMessages(roomId): Observable<Message[]>;

  onMessage(roomId): Observable<Message>;

  onTyping(roomId): Observable<Player>;

  typing(roomId): void;

  publishMessage(roomId, message, mediaId);

  onPlayerJoined(roomId): Observable<Player>;

  onPlayerLeft(roomId): Observable<Player>;

}

export interface Canvas {

  clearCanvas(roomId);

  startDrawShape(roomId, shape: NewShapeDetails);

  drawTick(roomId, position: Point2D);

  endDrawShape(roomId, shape: Shape);

  onClearCanvas(roomId): Observable<void>;

  onStartDrawShape(roomId): Observable<NewShapeDetails>;

  onDrawTick(roomId): Observable<Point2D>;

  onEndDrawShape(roomId): Observable<void>;

  onAllShapes(roomId): Observable<Shape[]>;

}

export interface GameRoom {

  onYourTurn(roomId): Observable<YourTurnDetails>;

  onYouAreWinner(roomId): Observable<void>;

  onStartRoundDetails(roomId): Observable<StartRoundDetails>;

  onEndRoundDetails(roomId): Observable<EndRoundDetails>;

}
