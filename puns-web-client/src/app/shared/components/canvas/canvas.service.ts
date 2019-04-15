import { Injectable } from '@angular/core';
import {WebsocketService} from '../../services/websocket/websocket.service';
import {NewShapeDetails} from './canvas-websocket.model';
import {Point2D, Shape} from './canvas.model';
import {Observable} from 'rxjs';
import {Canvas} from '../../abstract/abstract';

@Injectable({
  providedIn: 'root'
})
export class CanvasService implements Canvas {

  constructor(private websocket: WebsocketService) { }

  clearCanvas(roomId) {
    this.websocket.getSocket().emit(`${roomId}/canvas/clear-canvas`);
  }

  startDrawShape(roomId, shape: NewShapeDetails) {
    this.websocket.getSocket().emit(`${roomId}/canvas/start-draw-shape`, shape);
  }

  drawTick(roomId, position: Point2D) {
    this.websocket.getSocket().emit(`${roomId}/canvas/draw-tick`, position);
  }

  endDrawShape(roomId, shape: Shape) {
    this.websocket.getSocket().emit(`${roomId}/canvas/end-draw-shape`, shape);
  }

  onClearCanvas(roomId): Observable<void> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/canvas/clear-canvas`, () => obs.next());
    });
  }

  onStartDrawShape(roomId): Observable<NewShapeDetails> {
    return Observable.create(obs => {
        this.websocket.getSocket().on(`${roomId}/canvas/start-draw-shape`, shape => obs.next(shape));
    });
  }

  onDrawTick(roomId): Observable<Point2D> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/canvas/draw-tick`, position => obs.next(position));
    });
  }

  onEndDrawShape(roomId): Observable<void> {
    return Observable.create(obs => {
      this.websocket.getSocket().on(`${roomId}/canvas/end-draw-shape`, () => obs.next());
    });
  }

  onAllShapes(roomId): Observable<Shape[]> {
    return Observable.create(obs => {
        this.websocket.getSocket().once(`${roomId}/canvas/all-shapes`, (shapes: Shape[]) => obs.next(shapes));
    });
  }


}
