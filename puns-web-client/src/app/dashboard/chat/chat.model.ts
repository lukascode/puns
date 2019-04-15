

export class MessageRequest {
    message: string;
    mediaId: string;
    _rid: string;

  constructor(message, mediaId, roomId) {
    this.message = message;
    this.mediaId = mediaId;
    this._rid = roomId;
  }
}

export class Message {
  playerId: number;
  playerNick: string;
  avatarId: string;
  mediaId: string;
  message: string | any;
  sendingTime: string;
}

export class Player {
  id: number;
  email: string;
  nick: string;
  avatarId: string;
  points?: number;
}
