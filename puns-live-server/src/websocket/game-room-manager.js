const GameRoom = require('./game-room');
const logger = require('../utils/logger');

module.exports = class GameRoomManager {

    constructor(io) {
        this.io = io;
        this.gameRooms = [];
        this._hookUpHandlers();
    }

    _hookUpHandlers() {
        this.io.on('connection', socket => {
            socket.on('disconnect', () => this._emitGameRoomsState());
            socket.on('game-rooms/get-all-rooms', () => {
                logger.info('get-all-rooms request by', socket.player.nick);
                this._emitGameRoomsState(socket);
            });
            socket.on('game-rooms/create-room', name => {
                logger.info(`create-room ${name} request by`, socket.player.nick);
                let gameRoom = new GameRoom(this, this.io, name);
                this.gameRooms.push(gameRoom);
                this._emitGameRoomsState();
            });
            socket.on('game-rooms/exists', roomId => {
                let roomIdx = this.gameRooms.findIndex(r => r.roomId == roomId);
                socket.emit('game-rooms/exists', { roomId: roomId, exists: roomIdx >= 0 });
            });
            socket.on('game-rooms/delete-room', roomId => {
                logger.info(`delete-room request by`, socket.player.nick);
                let roomIdx = this.gameRooms.findIndex(r => r.roomId == roomId);
                if (roomIdx >= 0) {
                    if (this.gameRooms[roomIdx].getGameRoomSummary().nOfParticipants == 0) {
                        this.gameRooms.splice(roomIdx, 1);
                        this._emitGameRoomsState();
                    }
                }
            });
        });
    }

    _emitGameRoomsState(socket) {
        const response = [];
        for(const gameRoom of this.gameRooms) {
            response.push(gameRoom.getGameRoomSummary());
        }
        if (socket) {
            socket.emit('game-rooms/state', response);
        } else {
            this.io.emit('game-rooms/state', response);
        }
    }

}