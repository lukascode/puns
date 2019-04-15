const uuid = require('uuid');
const logger = require('../utils/logger');

module.exports = class Canvas {

    constructor(gameRoom) {
        this.gameRoom = gameRoom;
        this.shapes = [];
        this._hookUpHandlers();
    }

    _hookUpHandlers() {
        this.gameRoom.io.on('connection', socket => this.__hookUpHandlers(socket));
        for(let socket of this.gameRoom.getAllSockets()) {
            this.__hookUpHandlers(socket);
        }
    }

    __hookUpHandlers(socket) {
        socket.on(`${this.gameRoom.roomId}/join`, () => {
            socket.emit(`${this.gameRoom.roomId}/canvas/all-shapes`, this.shapes);
        });
        socket.on(`${this.gameRoom.roomId}/canvas/clear-canvas`, () => {
            this.shapes = [];
            socket.to(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/canvas/clear-canvas`);
        });
        socket.on(`${this.gameRoom.roomId}/canvas/start-draw-shape`, shape => {
            socket.to(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/canvas/start-draw-shape`, shape);
        });
        socket.on(`${this.gameRoom.roomId}/canvas/end-draw-shape`, shape => {
            this.shapes.push(shape);
            socket.to(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/canvas/end-draw-shape`);
        });
        socket.on(`${this.gameRoom.roomId}/canvas/draw-tick`, position => {
            socket.to(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/canvas/draw-tick`, position);
        });
    }

    clearCanvas() {
        this.shapes = [];
        this.gameRoom.io.in(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/canvas/clear-canvas`);
    }

}