import { Game } from '../../../domain/entities/game.entity';
import { Player } from '../../../domain/entities/player.entity';
import { InMemoryGameRepository } from '../../../infrastructure/persistence/in-memory-game.repository';

describe('InMemoryGameRepository', () => {
  let repository: InMemoryGameRepository;

  beforeEach(() => {
    repository = new InMemoryGameRepository();
  });

  describe('save', () => {
    it('should save a new game', async () => {
      const game = Game.create('game-1', 'player-1');

      await repository.save(game);

      const retrieved = await repository.findById('game-1');
      expect(retrieved).toEqual(game);
    });

    it('should update existing game', async () => {
      const game = Game.create('game-1', 'player-1');
      await repository.save(game);

      const player = Player.create('player-1', 'Alice');
      game.addPlayer(player);

      await repository.save(game);

      const retrieved = await repository.findById('game-1');
      expect(retrieved!.players.size).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return game when found', async () => {
      const game = Game.create('game-1', 'player-1');
      await repository.save(game);

      const result = await repository.findById('game-1');

      expect(result).toEqual(game);
    });

    it('should return null when game not found', async () => {
      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all games', async () => {
      const game1 = Game.create('game-1', 'player-1');
      const game2 = Game.create('game-2', 'player-2');

      await repository.save(game1);
      await repository.save(game2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(game1);
      expect(result).toContainEqual(game2);
    });

    it('should return empty array when no games exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete existing game', async () => {
      const game = Game.create('game-1', 'player-1');
      await repository.save(game);

      await repository.delete('game-1');

      const result = await repository.findById('game-1');
      expect(result).toBeNull();
    });

    it('should not throw error when deleting non-existent game', async () => {
      await expect(repository.delete('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('findByCreator', () => {
    it('should return games created by specific player', async () => {
      const game1 = Game.create('game-1', 'player-1');
      const game2 = Game.create('game-2', 'player-1');
      const game3 = Game.create('game-3', 'player-2');

      await repository.save(game1);
      await repository.save(game2);
      await repository.save(game3);

      const result = await repository.findByCreator('player-1');

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(game1);
      expect(result).toContainEqual(game2);
    });

    it('should return empty array when no games found for creator', async () => {
      const result = await repository.findByCreator('non-existent');

      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('should return games with specific status', async () => {
      const game1 = Game.create('game-1', 'player-1');
      const game2 = Game.create('game-2', 'player-2');

      await repository.save(game1);
      await repository.save(game2);

      const result = await repository.findByStatus('waiting');

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(game1);
      expect(result).toContainEqual(game2);
    });

    it('should return empty array when no games found with status', async () => {
      const result = await repository.findByStatus('completed');

      expect(result).toEqual([]);
    });
  });

  describe('existsById', () => {
    it('should return true when game exists', async () => {
      const game = Game.create('game-1', 'player-1');
      await repository.save(game);

      const result = await repository.existsById('game-1');

      expect(result).toBe(true);
    });

    it('should return false when game does not exist', async () => {
      const result = await repository.existsById('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('findAvailableGames', () => {
    it('should return games available to join', async () => {
      const game1 = Game.create('game-1', 'player-1');
      const game2 = Game.create('game-2', 'player-2');

      await repository.save(game1);
      await repository.save(game2);

      const result = await repository.findAvailableGames();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(game1);
      expect(result).toContainEqual(game2);
    });

    it('should return empty array when no games available', async () => {
      const result = await repository.findAvailableGames();

      expect(result).toEqual([]);
    });
  });

  describe('findActiveGamesForPlayer', () => {
    it('should return active games for a player', async () => {
      const game = Game.create('game-1', 'player-1');
      const player = Player.create('player-1', 'Alice');
      game.addPlayer(player);

      await repository.save(game);

      const result = await repository.findActiveGamesForPlayer('player-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(game);
    });

    it('should return empty array when player has no active games', async () => {
      const result = await repository.findActiveGamesForPlayer('non-existent');

      expect(result).toEqual([]);
    });
  });
});
