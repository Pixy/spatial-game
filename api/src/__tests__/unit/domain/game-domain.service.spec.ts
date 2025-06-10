import { Game } from '../../../domain/entities/game.entity';
import { Player } from '../../../domain/entities/player.entity';
import { GameDomainService } from '../../../domain/services/game-domain.service';
import { ItemPosition } from '../../../domain/value-objects/item-position.vo';

describe('GameDomainService', () => {
  let service: GameDomainService;
  let game: Game;
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    service = new GameDomainService();
    player1 = Player.create('player-1', 'Alice');
    player2 = Player.create('player-2', 'Bob');
    game = Game.create('game-1', 'player-1');
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.startGame();
  });

  describe('calculateHappinessScore', () => {
    it('should calculate happiness score for animals', () => {
      const animalPositions = new Map<string, ItemPosition>();
      animalPositions.set('cat_1', new ItemPosition(2, 2));
      animalPositions.set('dog_1', new ItemPosition(2, 3));

      const happiness = service.calculateHappinessScore(game, animalPositions);

      expect(typeof happiness).toBe('number');
      expect(happiness).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for no animals', () => {
      const animalPositions = new Map<string, ItemPosition>();

      const happiness = service.calculateHappinessScore(game, animalPositions);

      expect(happiness).toBe(0);
    });
  });

  describe('canPlayerMakeMove', () => {
    it('should allow valid moves', () => {
      const position = new ItemPosition(2, 3);

      const canMove = service.canPlayerMakeMove(game, 'player-1', position);

      expect(canMove).toBe(true);
    });

    it('should reject moves when not active', () => {
      const position = new ItemPosition(2, 3);

      // Force game to waiting status
      const waitingGame = Game.create('game-2', 'player-1');

      const canMove = service.canPlayerMakeMove(
        waitingGame,
        'player-1',
        position,
      );

      expect(canMove).toBe(false);
    });

    it('should reject moves from wrong player', () => {
      const position = new ItemPosition(2, 3);

      const canMove = service.canPlayerMakeMove(game, 'player-2', position);

      expect(canMove).toBe(false);
    });

    it('should reject out of bounds moves', () => {
      const position = new ItemPosition(10, 10);

      const canMove = service.canPlayerMakeMove(game, 'player-1', position);

      expect(canMove).toBe(false);
    });
  });

  describe('determineWinner', () => {
    it('should determine winner with highest score', () => {
      const scores = new Map<string, number>();
      scores.set('player-1', 100);
      scores.set('player-2', 80);

      const winner = service.determineWinner(scores);

      expect(winner).toBe('player-1');
    });

    it('should return null for tie', () => {
      const scores = new Map<string, number>();
      scores.set('player-1', 100);
      scores.set('player-2', 100);

      const winner = service.determineWinner(scores);

      expect(winner).toBeNull();
    });

    it('should return null for empty scores', () => {
      const scores = new Map<string, number>();

      const winner = service.determineWinner(scores);

      expect(winner).toBeNull();
    });
  });

  describe('shouldGameEnd', () => {
    it('should end game when max turns reached', () => {
      // Force max turns
      const gameData = game.toJSON();
      const maxTurnsGame = Game.fromPersistence({
        ...gameData,
        turnCount: gameData.maxTurns,
        players: new Map([
          ['player-1', player1],
          ['player-2', player2],
        ]),
        items: new Map(),
        itemPositions: new Map(),
      });

      const shouldEnd = service.shouldGameEnd(maxTurnsGame);

      expect(shouldEnd).toBe(true);
    });

    it('should not end active game with turns remaining', () => {
      const shouldEnd = service.shouldGameEnd(game);

      expect(shouldEnd).toBe(false);
    });

    it('should not end inactive game', () => {
      const waitingGame = Game.create('game-2', 'player-1');

      const shouldEnd = service.shouldGameEnd(waitingGame);

      expect(shouldEnd).toBe(false);
    });
  });
});
