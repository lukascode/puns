module.exports = class PublicMessage {

    constructor(playerId, playerNick, avatarId, mediaId, message, sendingTime) {
        this.playerId = playerId;
        this.playerNick = playerNick;
        this.avatarId = avatarId;
        this.mediaId = mediaId;
        this.message = message;
        this.sendingTime = sendingTime;
        if(!this.sendingTime) {
            this.sendingTime = new Date();
        }
    }

}