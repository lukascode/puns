
export class UpdatePlayerAvatar {
  playerId: number;
  avatarId: string;

  constructor(playerId, avatarId) {
    this.playerId = playerId;
    this.avatarId = avatarId;
  }

}
