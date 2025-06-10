import { Player } from '../../../domain/entities/player.entity';
import { DomainException } from '../../../shared/exceptions/domain.exceptions';

describe('Player Entity', () => {
  describe('create', () => {
    it('should create a player with valid data', () => {
      const player = Player.create('player-1', 'John Doe');

      expect(player.id).toBe('player-1');
      expect(player.name).toBe('John Doe');
      expect(player.score).toBe(0);
      expect(player.isActive).toBe(true);
    });

    it('should throw error for empty ID', () => {
      expect(() => Player.create('', 'John Doe')).toThrow(DomainException);
    });

    it('should throw error for empty name', () => {
      expect(() => Player.create('player-1', '')).toThrow(DomainException);
    });

    it('should throw error for name too long', () => {
      const longName = 'A'.repeat(51);
      expect(() => Player.create('player-1', longName)).toThrow(
        DomainException,
      );
    });
  });

  describe('updateScore', () => {
    it('should update player score', () => {
      const player = Player.create('player-1', 'John Doe');
      player.updateScore(100);

      expect(player.score).toBe(100);
    });

    it('should add to existing score', () => {
      const player = Player.create('player-1', 'John Doe');
      player.updateScore(50);
      player.updateScore(25);

      expect(player.score).toBe(75);
    });

    it('should throw error for negative points', () => {
      const player = Player.create('player-1', 'John Doe');
      expect(() => player.updateScore(-10)).toThrow(DomainException);
    });
  });

  describe('changeName', () => {
    it('should change player name', () => {
      const player = Player.create('player-1', 'John Doe');
      player.changeName('Jane Smith');

      expect(player.name).toBe('Jane Smith');
    });

    it('should throw error for empty new name', () => {
      const player = Player.create('player-1', 'John Doe');
      expect(() => player.changeName('')).toThrow(DomainException);
    });

    it('should throw error for new name too long', () => {
      const player = Player.create('player-1', 'John Doe');
      const longName = 'A'.repeat(51);
      expect(() => player.changeName(longName)).toThrow(DomainException);
    });
  });

  describe('equals', () => {
    it('should return true for players with same ID', () => {
      const player1 = Player.create('player-1', 'John Doe');
      const player2 = Player.create('player-1', 'Jane Smith');

      expect(player1.equals(player2)).toBe(true);
    });

    it('should return false for players with different IDs', () => {
      const player1 = Player.create('player-1', 'John Doe');
      const player2 = Player.create('player-2', 'John Doe');

      expect(player1.equals(player2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const player = Player.create('player-1', 'John Doe');
      player.updateScore(100);

      const json = player.toJSON();

      expect(json).toEqual({
        id: 'player-1',
        name: 'John Doe',
        score: 100,
        isActive: true,
      });
    });
  });
});
