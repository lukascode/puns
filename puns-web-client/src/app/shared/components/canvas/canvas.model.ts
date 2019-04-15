

export class Point2D {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static of(x, y) {
    return new Point2D(x, y);
  }

}

export class Config {

  color: string;
  lineCap: string;
  lineWidth: number;

  constructor(color, lineWidth) {
    this.color = color;
    this.lineWidth = lineWidth;
    this.lineCap = 'round';
  }

}

export abstract class Shape {

  config: Config;
  shapeType: string;

  static createShape(shapeType, config: Config, startPosition: Point2D) {
    const shape = Shape.create(shapeType, startPosition);
    shape.setShapeType(shapeType);
    shape.setConfig(config);
    return shape;
  }

  static createUninitializedShape(shapeType) {
    return Shape.create(shapeType, null);
  }

  static create(shapeType, startPosition) {
    let shape: Shape;
    switch (shapeType) {
      case 'pencil': shape = new Curve(startPosition); break;
      case 'line': shape =  new Line(startPosition); break;
      case 'rectangle': shape = new Rectangle(startPosition); break;
      case 'circle': shape = new Circle(startPosition); break;
      case 'rubber': shape = new Rubber(startPosition); break;
      default: throw new Error(`Shape ${shapeType} is not supported`);
    }
    return shape;
  }

  setConfig(config) {
    this.config = config;
  }

  setShapeType(shapeType) {
    this.shapeType = shapeType;
  }

  applyConfig(context: CanvasRenderingContext2D) {
    context.lineWidth = this.config.lineWidth;
    context.lineCap = this.config.lineCap;
    context.strokeStyle = this.config.color;
    context.fillStyle = this.config.color;
  }

  abstract draw(context: CanvasRenderingContext2D);

  abstract tick(cursorPos: Point2D);

}

export class Line extends Shape {

  p1: Point2D;
  p2: Point2D;

  constructor(startPosition: Point2D) {
    super();
    this.p1 = startPosition;
    this.p2 = startPosition;
  }

  draw(context: CanvasRenderingContext2D) {
    this.applyConfig(context);
    context.beginPath();
    context.moveTo(this.p1.x, this.p1.y);
    context.lineTo(this.p2.x, this.p2.y);
    context.closePath();
    context.stroke();
  }

  tick(cursorPos: Point2D) {
    this.p2 = cursorPos;
  }

}

export class Rectangle extends Shape {

  p1: Point2D;
  p2: Point2D;

  constructor(startPosition: Point2D) {
    super();
    this.p1 = startPosition;
    this.p2 = startPosition;
  }

  draw(context: CanvasRenderingContext2D) {
    this.applyConfig(context);
    let point: Point2D;
    let width, height;
    if (this.p2.x < this.p1.x && this.p2.y < this.p1.y) {
      point = this.p2;
      width = this.p1.x - this.p2.x;
      height = this.p1.y - this.p2.y;
    } else if (this.p2.x < this.p1.x) {
      point = Point2D.of(this.p2.x, this.p1.y);
      width = this.p1.x - this.p2.x;
      height = this.p2.y - this.p1.y;
    } else if (this.p2.y < this.p1.y) {
      point = Point2D.of(this.p1.x, this.p2.y);
      width = this.p2.x - this.p1.x;
      height = this.p1.y - this.p2.y;
    } else {
      point = this.p1;
      width = this.p2.x - this.p1.x;
      height = this.p2.y - this.p1.y;
    }
    context.strokeRect(point.x, point.y, width, height);
  }

  tick(cursorPos: Point2D) {
    this.p2 = cursorPos;
  }

}

export class Circle extends Shape {

  p: Point2D;
  radius: number;

  constructor(startPosition: Point2D) {
    super();
    this.p = startPosition;
    this.radius = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    this.applyConfig(context);
    context.beginPath();
    context.arc(this.p.x, this.p.y, this.radius, 0, 2 * Math.PI, false);
    context.closePath();
    context.stroke();
  }

  tick(cursorPos: Point2D) {
    this.radius = Math.round(Math.sqrt(Math.pow(cursorPos.x - this.p.x, 2) + Math.pow(cursorPos.y - this.p.y, 2)));
  }

}

export class Curve extends Shape {

  startPosition: Point2D;
  points: Point2D[];

  constructor(startPosition: Point2D) {
    super();
    this.startPosition = startPosition;
    this.points = [];
  }

  draw(context: CanvasRenderingContext2D) {
    this.applyConfig(context);
    context.beginPath();
    context.moveTo(this.startPosition.x, this.startPosition.y);
    for (const point of this.points) {
      context.lineTo(point.x, point.y);
    }
    context.stroke();
  }

  tick(cursorPos: Point2D) {
    this.points.push(cursorPos);
  }

}

export class Rubber extends Shape {

  points: Point2D[];
  width: number;

  constructor(startPosition: Point2D) {
    super();
    this.points = [ startPosition ];
    this.width = 30;
  }

  draw(context: CanvasRenderingContext2D) {
    this.applyConfig(context);
    for (const point of this.points) {
      context.clearRect(point.x - this.width, point.y - this.width, this.width, this.width);
    }
  }

  tick(cursorPos: Point2D) {
    this.points.push(cursorPos);
  }
}
