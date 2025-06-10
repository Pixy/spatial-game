import { Game } from '../../../src/domain/entities/game.entity';
import { Player } from '../../../src/domain/entities/player.entity';
import { ItemPosition } from '../../../src/domain/value-objects/item-position.vo';
import { DomainException } from '../../../src/shared/exceptions/domain.exceptions';

describe('Game Entity', () => {
  let player1: Player;
  let player2: Player;

  beforeEach(() => {
    player1 = Player.create('player-1', 'Player 1');
    player2 = Player.create('player-2', 'Player 2');
  });

  describe('create', () => {
    it('should create a game with valid data', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);

      expect(game.id).toBe('game-1');
      expect(game.createdBy).toBe('player-1');
      expect(game.status).toBe('waiting');
      expect(game.difficulty).toBe('easy');
      expect(game.gridSize).toBe(5);
      expect(game.maxTurns).toBe(30); // Easy difficulty = 30 turns
    });

    it('should set correct max turns for medium difficulty', () => {
      const game = Game.create('game-1', 'player-1', 'medium', 5);
      expect(game.maxTurns).toBe(50);
    });

    it('should set correct max turns for hard difficulty', () => {
      const game = Game.create('game-1', 'player-1', 'hard', 5);
      expect(game.maxTurns).toBe(80);
    });

    it('should throw error for invalid grid size', () => {
      expect(() => Game.create('game-1', 'player-1', 'easy', 2)).toThrow(
        DomainException,
      );
      expect(() => Game.create('game-1', 'player-1', 'easy', 11)).toThrow(
        DomainException,
      );
    });
  });

  describe('addPlayer', () => {
    it('should add player to waiting game', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);

      expect(game.players.has('player-1')).toBe(true);
      expect(game.players.size).toBe(1);
    });

    it('should not add same player twice', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);

      expect(() => game.addPlayer(player1)).toThrow(DomainException);
    });

    it('should not add player to non-waiting game', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);
      game.startGame();

      expect(() => game.addPlayer(player2)).toThrow(DomainException);
    });

    it('should not allow more than 4 players', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      const players = [
        Player.create('p1', 'Player 1'),
        Player.create('p2', 'Player 2'),
        Player.create('p3', 'Player 3'),
        Player.create('p4', 'Player 4'),
        Player.create('p5', 'Player 5'),
      ];

      players.slice(0, 4).forEach((player) => game.addPlayer(player));
      expect(() => game.addPlayer(players[4])).toThrow(DomainException);
    });
  });

  describe('startGame', () => {
    it('should start game with at least 1 player', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);

      game.startGame();

      expect(game.status).toBe('active');
      expect(game.currentTurn).toBe('player-1');
      expect(game.turnCount).toBe(1);
    });

    it('should not start game without players', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);

      expect(() => game.startGame()).toThrow(DomainException);
    });

    it('should not start already active game', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);
      game.startGame();

      expect(() => game.startGame()).toThrow(DomainException);
    });
  });

  describe('placeItem', () => {
    let game: Game;

    beforeEach(() => {
      game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);
      game.addPlayer(player2);
      game.startGame();
    });

    it('should place item for current player', () => {
      const position = ItemPosition.fromCoordinates(2, 2);

      game.placeItem('item-1', position, 'player-1');

      expect(game.itemPositions.has('item-1')).toBe(true);
      expect(game.currentTurn).toBe('player-2'); // Turn should advance
      expect(game.turnCount).toBe(2);
    });

    it('should not allow non-current player to place item', () => {
      const position = ItemPosition.fromCoordinates(2, 2);

      expect(() => game.placeItem('item-1', position, 'player-2')).toThrow(
        DomainException,
      );
    });

    it('should not allow placing item outside grid', () => {
      const position = ItemPosition.fromCoordinates(10, 10);

      expect(() => game.placeItem('item-1', position, 'player-1')).toThrow(
        DomainException,
      );
    });

    it('should not allow placing item on occupied position', () => {
      const position = ItemPosition.fromCoordinates(2, 2);

      game.placeItem('item-1', position, 'player-1');
      expect(() => game.placeItem('item-2', position, 'player-2')).toThrow(
        DomainException,
      );
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const game = Game.create('game-1', 'player-1', 'easy', 5);
      game.addPlayer(player1);

      const json = game.toJSON();

      expect(json).toEqual({
        id: 'game-1',
        createdBy: 'player-1',
        status: 'waiting',
        difficulty: 'easy',
        gridSize: 5,
        players: [player1.toJSON()],
        currentTurn: null,
        turnCount: 0,
        maxTurns: 30,
        itemPositions: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
