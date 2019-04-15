const logger = require('../utils/logger');
const emojis = require('emojis');
const PublicMessage = require('../models/public-message.model');
const conf = require('../config');

module.exports = class Chat {

    constructor(gameRoom) {
        this.gameRoom = gameRoom;
        this._hookUpHandlers();
    }

    _hookUpHandlers() {
        this.gameRoom.io.on('connection', socket => this.__hookUpHandlers(socket));
        for(let socket of this.gameRoom.getAllSockets()) {
            this.__hookUpHandlers(socket);
        }
    }

    __hookUpHandlers(socket) {
        socket.on(`${this.gameRoom.roomId}/chat/typing`, () => {
            socket.to(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/chat/typing`, socket.player);
        });
        socket.on(`${this.gameRoom.roomId}/chat/message`, message => {
            logger.info(`Received message ${message}`);
            if(this._isValidMessage(socket, message)) {
                if (this.gameRoom.gameplay && this.gameRoom.currentWord) {
                    if(message.message.toLowerCase().indexOf(this.gameRoom.currentWord.toLowerCase()) >= 0) {
                        message.message = ':star2: ' + message.message;
                        this.gameRoom.playerGuessedWord(socket);
                    }
                }
                let msg = new PublicMessage(
                    socket.player.id, 
                    socket.player.nick,
                    socket.player.avatarId,
                    message.mediaId,
                    emojis.html(message.message, conf.app.emojis_uri)
                    );
                this.gameRoom.io.sockets.in(this.gameRoom.roomId).emit(`${this.gameRoom.roomId}/chat/message`, msg);

            } else {
                logger.warn('Message is not valid', message);
            }
        });
    }

    _isValidMessage(socket, message) {
        if(this.gameRoom.roomId === message._rid && this.gameRoom.isPresent(socket)) {
            return true;
        }
        return false;
    }

}