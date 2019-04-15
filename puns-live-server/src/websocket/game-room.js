const uuid = require('uuid');
const Chat = require('./chat');
const Canvas = require('./canvas');
const logger = require('../utils/logger');
const PunsCore = require('../boundary/puns-core');
const AddScoreRequest = require('../boundary/add-score-request');

module.exports = class GameRoom {

    constructor(gameRoomManager, io, name) {
        this.gameRoomManager = gameRoomManager;
        this.io = io;
        this.name = name;
        this.roomId = uuid.v4();
        this.chat = new Chat(this);
        this.canvas = new Canvas(this);
        this._hookUpHandlers();


        this.gameplay = false;
        this.currentWord = null;
        this.currentPlayer = null;
        this.roundTime = 210;
        this.roundTimeout = null;
        this.timeLeft = 0;
        this.roundStartedAt = null;
        this.playersPoints = new Map();
        this.pointsAmountForWinner = 15;
        this.pointsAmountForDrawer = 5;

        this._startGame();
    }

    _hookUpHandlers() {
        this.io.on('connection', socket => this.__hookUpHandlers(socket));
        for(let socket of this.getAllSockets()) {
            this.__hookUpHandlers(socket);
        }
    }

    __hookUpHandlers(socket) {
        socket.on('disconnect', () => {
            this.playersPoints.delete(socket);
            this._emitPresentState();
        });
            socket.on(`${this.roomId}/join`, nick => {
                logger.info(`${socket.player.nick} join ${this.roomId}`);
                socket.join(this.roomId);

                this.playersPoints.set(socket, 0);

                if (this.gameplay) {
                    socket.emit(`${this.roomId}/start-round-details`, { turn: this.currentPlayer.player, time: this.roundTime, roundStartedAt: this.roundStartedAt })
                } 
                socket.to(this.roomId).emit(`${this.roomId}/new-player-joined`, socket.player);
                this._emitPresentState();
                this.gameRoomManager._emitGameRoomsState();
            });
            socket.on(`${this.roomId}/leave`, () => {
                if(Object.keys(socket.rooms).includes(this.roomId)) {
                    logger.info(`${socket.player.nick} leave ${this.roomId}`);
                    socket.leave(this.roomId);
                    socket.to(this.roomId).emit(`${this.roomId}/player-left-room`, socket.player);
                    this.playersPoints.delete(socket);
                    this._emitPresentState();
                    this.gameRoomManager._emitGameRoomsState();
                }
            });
            socket.on(`${this.roomId}/summary`, () => {
                socket.emit(`${this.roomId}/summary`, this.getGameRoomSummary());
            });
    }

    _startGame() {
        setInterval(() => {
            if(!this.gameplay && this._getSocketsInRoom().length > 1) {
                this._startGameRound();
            } else if (this.gameplay && this._getSocketsInRoom().length <= 1) {
                this.gameplay = false;
                if (this.roundTimeout) {
                    clearTimeout(this.roundTimeout);
                }
                this.io.in(this.roomId).emit(`${this.roomId}/end-round-details`, { winner: null, word: this.currentWord });
            }
        }, 8000);
   
    }

    playerGuessedWord(playerSocket) {
        if(playerSocket.player.id != this.currentPlayer.player.id) {
            if (this.roundTimeout) {
                clearTimeout(this.roundTimeout);
            }
            PunsCore.addScoreForPlayer(
                new AddScoreRequest(playerSocket.player.id, this.pointsAmountForWinner, this.roomId, this.currentWord)
            ).then(() => {
                PunsCore.addScoreForPlayer(
                    new AddScoreRequest(this.currentPlayer.player.id, this.pointsAmountForDrawer, this.roomId, this.currentWord)
                )
            })
            .then(() => {
                this.playersPoints.set(playerSocket, this.playersPoints.get(playerSocket) + this.pointsAmountForWinner);
                this.playersPoints.set(this.currentPlayer, this.playersPoints.get(this.currentPlayer) + this.pointsAmountForDrawer);
                this._emitPresentState();
            }).catch(err => logger.error(err));
            this.io.in(this.roomId).emit(`${this.roomId}/end-round-details`, { winner: playerSocket.player, word: this.currentWord });
            playerSocket.emit(`${this.roomId}/you-are-winner`);
            this.gameplay = false;
        }
    }

    _startGameRound() {
        if(!this.gameplay) {
            this.gameplay = true;
            PunsCore.getRandomWord().then(word => {
                let playerSocket = this._getRandomPlayer();

                this.currentWord = word;
                this.currentPlayer = playerSocket;

                this.canvas.clearCanvas();

                this.roundStartedAt = new Date();
                playerSocket.emit(`${this.roomId}/your-turn`, { turn: playerSocket.player, word, time: this.roundTime, roundStartedAt: this.roundStartedAt });
                playerSocket.to(this.roomId).emit(`${this.roomId}/start-round-details`, { turn: playerSocket.player, time: this.roundTime, roundStartedAt: this.roundStartedAt })

                this.roundTimeout = setTimeout(() => {
                    this.gameplay = false;
                    this.io.in(this.roomId).emit(`${this.roomId}/end-round-details`, { winner: null, word: this.currentWord });
                }, this.roundTime * 1000);

            }).catch(err => logger.error(err));
        }
    }

    _getRandomPlayer() {
        let sockets = this._getSocketsInRoom();
        return sockets[Math.floor(Math.random() * sockets.length)];
    }

    getGameRoomSummary() {
        return {
            roomId: this.roomId,
            name: this.name,
            nOfParticipants: this._getPlayersInRoom().length
        };
    }

    isPresent(socket) {
        if (socket) {
            return Object.keys(socket.rooms).includes(this.roomId);
        }
        return false;
    }

    getAllSockets() {
        let result = [];
        let sockets = this.io.sockets.sockets;
        for(let socketId in sockets) {
            result.push(sockets[socketId]);
        }
        return result;
    }

    _emitPresentState() {
        setTimeout(() => {
            this.io.in(this.roomId).emit(`${this.roomId}/present-state`, this._getPlayersInRoom());
        }, 500);
    }

    _getPlayersInRoom() {
        return this._getSocketsInRoom().map(s => {
            const pointsAmount = this.playersPoints.get(s);
            return {
                id: s.player.id,
                email: s.player.email,
                nick: s.player.nick,
                avatarId: s.player.avatarId,
                points: pointsAmount
            };
        })
        .filter(p => p);
    }

    _getSocketsInRoom() {
        let sockets = [];
        const room = this.io.sockets.adapter.rooms[this.roomId];
        if (room) {
            let clients = room.sockets;
            for(let clientId in clients) {
                let clientSocket = this.io.sockets.connected[clientId];
                sockets.push(clientSocket);
            }
        }
        return sockets;
    }


}