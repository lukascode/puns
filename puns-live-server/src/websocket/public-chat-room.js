const uuid = require('uuid');
const PublicChat = require('../models/public-chat.model');
const PublicMessage = require('../models/public-message.model');
const logger = require('../utils/logger');
const emojis = require('emojis');
const conf = require('../config');

module.exports = class PublicChatRoom {

    constructor(io) {
        this.io = io;
        this.roomId = 'public-chat';
        this._hookUpHandlers();
    }

    _hookUpHandlers() {
        this.io.on('connection', socket => {
            socket.on('disconnect', () => this._emitPresentState());
            socket.on(`${this.roomId}/join`, nick => {
                logger.info(`[public-chat-room ${this.roomId}] New client (${nick}) joined with socket id: ${socket.id}`);
                socket.join(this.roomId);
                this._emitPresentState();
                socket.to(this.roomId).emit(`${this.roomId}/new-player-joined`, socket.player);
            });
            socket.on(`${this.roomId}/leave`, () => this._leaveRoom(socket));
            socket.on(`${this.roomId}/chat/typing`, () => {
                socket.to(this.roomId).emit(`${this.roomId}/chat/typing`, socket.player);
            });
            socket.on(`${this.roomId}/chat/message`, message => {
                if(this._isValidMessage(socket, message)) {
                    let msg = new PublicMessage(
                        socket.player.id, 
                        socket.player.nick,
                        socket.player.avatarId,
                        message.mediaId,
                        emojis.html(message.message, conf.app.emojis_uri)
                        );
                    PublicChat.addMessage(msg).then(r => {
                        this.io.sockets.in(this.roomId).emit(`${this.roomId}/chat/message`, msg);
                    }).catch(err => logger.error(err));
                } else {
                    logger.warn(`[public-chat-room ${this.roomId}] Message { message: ${message}} is not valid`)
                }
            });
        });
    }

    _leaveRoom(socket) {
        if(Object.keys(socket.rooms).includes(this.roomId)) {
            socket.leave(this.roomId);
            socket.to(this.roomId).emit(`${this.roomId}/player-left-room`, socket.player);
            this._emitPresentState();
            logger.info(`Player ${socket.player.nick} left room ${this.roomId}`);
        }
    }

    _emitPresentState() {
        console.log('Emit present state for room:', this.roomId);
        setTimeout(() => {
            this.io.in(this.roomId).emit(`${this.roomId}/present-state`, this._getPlayersInRoom());
        }, 500);
    }

    _getPlayersInRoom() {
        let players = [];
        const room = this.io.sockets.adapter.rooms[this.roomId];
        if (room) {
            let clients = room.sockets;
            for(let clientId in clients) {
                let clientSocket = this.io.sockets.connected[clientId];
                players.push(clientSocket.player);
            }
        }
        return players;
    }

    _isValidMessage(socket, message) {
        if(this.roomId === message._rid && this._isPresent(socket)) {
            return true;
        }
        return false;
    }

    _isPresent(socket) {
        if (socket) {
            return Object.keys(socket.rooms).includes(this.roomId);
        }
        return false;
    }

}