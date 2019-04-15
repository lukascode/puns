import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Config, Point2D, Shape} from './canvas.model';
import {MatButtonToggleGroup} from '@angular/material';
import {CanvasService} from './canvas.service';
import {NewShapeDetails} from './canvas-websocket.model';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy {

  @Input() roomId: string;

  @Input() disabled: boolean;

  @ViewChild('canvas') canvasElement: ElementRef;

  @ViewChild('toolGroup') toolGroup: MatButtonToggleGroup;

  @ViewChild('colorPicker') colorPicker: ElementRef;

  @ViewChild('thicknessValue') thicknessValue: ElementRef;

  thickness = [
    { name: '\u2581\u2581\u2581\u2581\u2581\u2581', value: 1},
    { name: '\u2582\u2582\u2582\u2582\u2582\u2582\u2582', value: 5},
    { name: '\u2583\u2583\u2583\u2583\u2583\u2583\u2583\u2583', value: 10},
    { name: '\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584', value: 20 }
  ];

  private draw = false;

  private shapes: Shape[] = [];

  private currentShape: Shape = null;

  private onClearCanvasSub;

  private onStartDrawShape;

  private onDrawTickSub;

  private onEndDrawShapeSub;

  private onAllShapesSub;

  constructor(private canvasService: CanvasService) { }

  ngOnInit() {

    if (!this.roomId) {
      console.error('[CanvasComponent] Bad context. Specify roomId');
      return;
    }

    if (!this.disabled) {
      this.disabled = false;
    }

    if (this.canvas.getContext) {

      this.canvas.addEventListener('mousedown', event => {
        if (event.which === 1 && !this.draw && !this.disabled) {
          this.draw = true;

          const position = this.getCursorPosition(event);
          const config = this.getCurrentConfig();
          const shapeType = this.toolGroup.value;

          this.currentShape = Shape.createShape(shapeType, config, position);

          this.canvasService.startDrawShape(this.roomId, new NewShapeDetails(config,  shapeType, position));
        }
      });

      this.canvas.addEventListener('mouseup', event => {
        if (event.which === 1 && !this.disabled) {
          this.draw = false;
          this.shapes.push(this.currentShape);
          this.canvasService.endDrawShape(this.roomId, this.currentShape);
        }
      });

      this.canvas.addEventListener('mousemove', event => {
        if (this.draw && !this.disabled) {
          const position = this.getCursorPosition(event);
          this.currentShape.tick(position);
          this.canvasService.drawTick(this.roomId, position);
          requestAnimationFrame(this.redraw.bind(this));
        }
      });

      this.onClearCanvasSub = this.canvasService.onClearCanvas(this.roomId).subscribe(() => {
        this.clearAll();
      });

      this.onStartDrawShape = this.canvasService.onStartDrawShape(this.roomId).subscribe((shape: NewShapeDetails) => {
        this.currentShape = Shape.createShape(shape.shapeType, shape.config, shape.startPosition);
      });

      this.onDrawTickSub = this.canvasService.onDrawTick(this.roomId).subscribe((position: Point2D) => {
          this.currentShape.tick(position);
          requestAnimationFrame(this.redraw.bind(this));
      });

      this.onEndDrawShapeSub = this.canvasService.onEndDrawShape(this.roomId).subscribe(() => {
          this.shapes.push(this.currentShape);
      });

      this.onAllShapesSub = this.canvasService.onAllShapes(this.roomId).subscribe((shapes: Shape[]) => {
          this.shapes = [];
          for (const shape of shapes) {
            this.shapes.push(Object.assign(Shape.createUninitializedShape(shape.shapeType), shape));
          }
          this.redraw();
      });

    } else {
      console.warn('Canvas is not supported');
    }
  }

  redraw() {
    this.resize();
    this.clearCanvas();
    for (const shape of this.shapes) {
      shape.draw(this.context);
    }
    if (this.currentShape) {
      this.currentShape.draw(this.context);
    }
  }

  clear() {
    this.clearAll();
    this.canvasService.clearCanvas(this.roomId);
  }

  clearAll() {
    this.shapes = [];
    this.clearCanvas();
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  ngOnDestroy() {
    if (this.onClearCanvasSub) {
      this.onClearCanvasSub.unsubscribe();
    }
    if (this.onAllShapesSub) {
      this.onAllShapesSub.unsubscribe();
    }
    if (this.onDrawTickSub) {
      this.onDrawTickSub.unsubscribe();
    }
    if (this.onEndDrawShapeSub) {
      this.onEndDrawShapeSub.unsubscribe();
    }
    if (this.onStartDrawShape) {
      this.onStartDrawShape.unsubscribe();
    }
  }

  private getCurrentConfig() {
    return new Config(this.colorPicker.nativeElement.value, this.thicknessValue.nativeElement.value);
  }

  private resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  private getCursorPosition(event) {
    let rect = this.canvas.getBoundingClientRect();
    let x = Math.round(event.clientX - rect.left);
    let y = Math.round(event.clientY - rect.top);
    return Point2D.of(x, y);
  }

  private get context() {
    return this.canvas.getContext('2d');
  }

  private get canvas() {
    return this.canvasElement.nativeElement;
  }

}
