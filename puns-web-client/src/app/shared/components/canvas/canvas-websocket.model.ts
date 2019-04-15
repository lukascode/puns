import {Config, Point2D} from './canvas.model';

export class NewShapeDetails {
  shapeType: string;
  config: Config;
  startPosition: Point2D;

  constructor(config, shapeType, startPosition) {
    this.config = config;
    this.shapeType = shapeType;
    this.startPosition = startPosition;
  }

}

