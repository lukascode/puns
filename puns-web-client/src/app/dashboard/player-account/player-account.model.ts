
export class ScoreSnapshot {
  id: number;
  points: number;
  gameRoomId: string;
  guessedWord: string;
  eventTimestamp: string;
}

export class PlayerSnapshot {
  id: number;
  email: string;
  nick: string;
  avatarId: string;
  creationTime: string;
  scores: ScoreSnapshot[];
}
