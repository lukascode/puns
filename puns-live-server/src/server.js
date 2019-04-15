const express = require('express');
const app = express();
const http = require('http').Server(app);
const api = require('./api/api');
const io = require('socket.io')(http);
const conf = require('./config');
const bodyParser = require('body-parser');

const mongoUtil = require('./utils/mongoUtil');
const PublicMessage = require('./models/public-message.model');
const PublicChat = require('./models/public-chat.model');
const PublicChatRoom = require('./websocket/public-chat-room');
const GameRoomManager = require('./websocket/game-room-manager');

const logger = require('./utils/logger');
const PunsCore = require('./boundary/puns-core');

process.setMaxListeners(Infinity);

mongoUtil.connectToServer().then(() => PunsCore.authenticate()).then(() => {

    app.use(bodyParser.json());

    app.use('/api', api);  
    app.use(express.static(__dirname + '/public'));

    
    io.setMaxListeners(Infinity);

    var pcr = new PublicChatRoom(io);
    var gmr = new GameRoomManager(io);

    io.on('connection', socket => {

        socket.setMaxListeners(Infinity);

        logger.info('New client connected with id: ', socket.id);

        socket.on('player-details', player => {
            logger.info('player details info', player.nick);
            socket.player = player;
            socket.emit('player-details-received');
        });
        socket.on('player-changed-avatar', player => {
            logger.info('player changed avatar to ', player.avatarId);
            socket.player.avatarId = player.avatarId;
        });
        socket.on('disconnect', () => {
            logger.info('Client width id: ' + socket.id + ' disconnected');
        });

    });

    http.listen(conf.app.port);
})
.catch((err) => logger.error(err));

process.on('warning', warn => logger.warn(warn.stack));

process.on('uncaughtException', err => {
    logger.error('uncaughtException', err);
});
