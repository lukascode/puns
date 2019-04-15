import {Player} from '../../chat/chat.model';


export class YourTurnDetails {
  turn: Player;
  word: string;
  time: number;
  roundStartedAt: string;
}

export class StartRoundDetails {
  turn: Player;
  time: number;
  roundStartedAt: string;
}

export class EndRoundDetails {
  winner: Player;
  word: string;
}

