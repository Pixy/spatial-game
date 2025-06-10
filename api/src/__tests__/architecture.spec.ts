import { Player } from '../domain/entities/player.entity';
import { DomainException } from '../shared/exceptions/domain.exceptions';

describe('Architecture Hexagonale - Player Entity', () => {
  it('should create a player successfully', () => {
    const player = Player.create('player-1', 'Alice');

    expect(player.id).toBe('player-1');
    expect(player.name).toBe('Alice');
    expect(player.score).toBe(0);
    expect(player.isActive).toBe(true);
  });

  it('should update player score', () => {
    const player = Player.create('player-1', 'Alice');
    player.updateScore(100);

    expect(player.score).toBe(100);
  });

  it('should throw domain exception for invalid data', () => {
    expect(() => Player.create('', 'Alice')).toThrow(DomainException);
    expect(() => Player.create('player-1', '')).toThrow(DomainException);
  });

  it('should return correct JSON representation', () => {
    const player = Player.create('player-1', 'Alice');
    player.updateScore(50);

    const json = player.toJSON();

    expect(json).toEqual({
      id: 'player-1',
      name: 'Alice',
      score: 50,
      isActive: true,
    });
  });
});
