import { PlayerAccountModule } from './player-account.module';

describe('PlayerAccountModule', () => {
  let playerAccountModule: PlayerAccountModule;

  beforeEach(() => {
    playerAccountModule = new PlayerAccountModule();
  });

  it('should create an instance', () => {
    expect(playerAccountModule).toBeTruthy();
  });
});
