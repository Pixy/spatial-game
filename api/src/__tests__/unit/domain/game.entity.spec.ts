import { Game } from '../../../domain/entities/game.entity';
import { Player } from '../../../domain/entities/player.entity';
import { DomainException } from '../../../shared/exceptions/domain.exceptions';

describe('Game Entity', () => {
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    player1 = Player.create('player-1', 'Alice');
    player2 = Player.create('player-2', 'Bob');
  });

  describe('create', () => {
    it('should create a game with default values', () => {
      const game = Game.create('game-1', 'player-1');

      expect(game.id).toBe('game-1');
      expect(game.createdBy).toBe('player-1');
      expect(game.status).toBe('waiting');
      expect(game.difficulty).toBe('easy');
      expect(game.gridSize).toBe(5);
      expect(game.turnCount).toBe(0);
      expect(game.players.size).toBe(0);
    });

    it('should create a game with custom difficulty and grid size', () => {
      const game = Game.create('game-1', 'player-1', 'hard', 8);

      expect(game.difficulty).toBe('hard');
      expect(game.gridSize).toBe(8);
    });

    it('should throw error for empty ID', () => {
      expect(() => Game.create('', 'player-1')).toThrow(DomainException);
    });

    it('should throw error for empty creator ID', () => {
      expect(() => Game.create('game-1', '')).toThrow(DomainException);
    });
  });

  describe('addPlayer', () => {
    it('should add a player to the game', () => {
      const game = Game.create('game-1', 'player-1');

      game.addPlayer(player1);

      expect(game.players.has('player-1')).toBe(true);
      expect(game.players.size).toBe(1);
    });

    it('should add multiple players', () => {
      const game = Game.create('game-1', 'player-1');

      game.addPlayer(player1);
      game.addPlayer(player2);

      expect(game.players.size).toBe(2);
      expect(game.players.has('player-1')).toBe(true);
      expect(game.players.has('player-2')).toBe(true);
    });

    it('should not add the same player twice', () => {
      const game = Game.create('game-1', 'player-1');

      game.addPlayer(player1);

      expect(() => game.addPlayer(player1)).toThrow(DomainException);
    });

    it('should throw error when game is full', () => {
      const game = Game.create('game-1', 'player-1');

      for (let i = 0; i < 4; i++) {
        const player = Player.create(`player-${i}`, `Player ${i}`);
        game.addPlayer(player);
      }

      const extraPlayer = Player.create('player-5', 'Player 5');
      expect(() => game.addPlayer(extraPlayer)).toThrow(DomainException);
    });

    it('should throw error when game is not in waiting status', () => {
      const game = Game.create('game-1', 'player-1');
      game.addPlayer(player1);
      game.startGame();

      expect(() => game.addPlayer(player2)).toThrow(DomainException);
    });
  });

  describe('startGame', () => {
    it('should start the game with at least one player', () => {
      const game = Game.create('game-1', 'player-1');
      game.addPlayer(player1);

      game.startGame();

      expect(game.status).toBe('active');
      expect(game.currentTurn).toBe('player-1');
    });

    it('should throw error with no players', () => {
      const game = Game.create('game-1', 'player-1');

      expect(() => game.startGame()).toThrow(DomainException);
    });

    it('should throw error when already started', () => {
      const game = Game.create('game-1', 'player-1');
      game.addPlayer(player1);
      game.startGame();

      expect(() => game.startGame()).toThrow(DomainException);
    });
  });

  describe('removePlayer', () => {
    it('should remove a player from the game', () => {
      const game = Game.create('game-1', 'player-1');
      game.addPlayer(player1);
      game.addPlayer(player2);

      game.removePlayer('player-1');

      expect(game.players.has('player-1')).toBe(false);
      expect(game.players.size).toBe(1);
    });

    it('should throw error when player is not in game', () => {
      const game = Game.create('game-1', 'player-1');

      expect(() => game.removePlayer('non-existent')).toThrow(DomainException);
    });

    it('should throw error when game is completed', () => {
      const game = Game.create('game-1', 'player-1');
      game.addPlayer(player1);

      // Force game to completed status for testing
      const gameData = game.toJSON();
      const completedGame = Game.fromPersistence({
        ...gameData,
        status: 'completed',
        players: new Map([['player-1', player1]]),
        items: new Map(),
        itemPositions: new Map(),
      });

      expect(() => completedGame.removePlayer('player-1')).toThrow(
        DomainException,
      );
    });
  });

  describe('difficulty-based max turns', () => {
    it('should set correct max turns for easy difficulty', () => {
      const game = Game.create('game-1', 'player-1', 'easy');
      expect(game.maxTurns).toBe(30);
    });

    it('should set correct max turns for medium difficulty', () => {
      const game = Game.create('game-1', 'player-1', 'medium');
      expect(game.maxTurns).toBe(50);
    });

    it('should set correct max turns for hard difficulty', () => {
      const game = Game.create('game-1', 'player-1', 'hard');
      expect(game.maxTurns).toBe(80);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const game = Game.create('game-1', 'player-1', 'medium', 6);
      game.addPlayer(player1);

      const json = game.toJSON();

      expect(json).toEqual({
        id: 'game-1',
        createdBy: 'player-1',
        status: 'waiting',
        difficulty: 'medium',
        gridSize: 6,
        players: [
          expect.objectContaining({
            id: 'player-1',
            name: 'Alice',
            score: 0,
            isActive: true,
          }),
        ],
        currentTurn: null,
        turnCount: 0,
        maxTurns: 50,
        itemPositions: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
