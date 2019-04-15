const express = require('express');
const PublicChat = require('../models/public-chat.model');
const UpdatePlayerAvatar = require('../models/update-player-avatar.model');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/:roomId/get-all-messages', (req, res, next) => {
    logger.info('Received Getting public-chat/get-all-messages request', req.params);
    if(req.params.roomId && req.params.roomId === 'public-chat') {
        PublicChat.getAllMessagesAsc().then(result => res.send(result)).catch(err => logger.error(err));
    } else {
        res.send([]);
    }
});

router.put('/public-chat/update-player-avatar', (req, res, next) => {
    logger.info('Received public-chat/update-player-avatar request', req.body);
    const updateRq = new UpdatePlayerAvatar(req.body.playerId, req.body.avatarId);
    PublicChat.updatePlayerAvatar(updateRq).then(result => {
        res.status(204).send({});
    })
    .catch(err => logger.error(err));
});

module.exports = router;