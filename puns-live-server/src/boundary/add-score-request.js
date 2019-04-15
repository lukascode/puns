module.exports = class AddScoreRequest {

    constructor(playerId, points, gameRoomId, guessedWord) {
        this.playerId = playerId;
        this.points = points;
        this.gameRoomId = gameRoomId;
        this.guessedWord = guessedWord;
    }

}