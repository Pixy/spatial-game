import { Player } from '../../../domain/entities/player.entity';
import { InMemoryPlayerRepository } from '../../../infrastructure/persistence/in-memory-player.repository';

describe('InMemoryPlayerRepository', () => {
  let repository: InMemoryPlayerRepository;

  beforeEach(() => {
    repository = new InMemoryPlayerRepository();
  });

  describe('save', () => {
    it('should save a new player', async () => {
      const player = Player.create('player-1', 'John Doe');

      await repository.save(player);

      const retrieved = await repository.findById('player-1');
      expect(retrieved).toEqual(player);
    });

    it('should update existing player', async () => {
      const player = Player.create('player-1', 'John Doe');
      await repository.save(player);

      player.updateScore(100);
      await repository.save(player);

      const retrieved = await repository.findById('player-1');
      expect(retrieved!.score).toBe(100);
    });
  });

  describe('findById', () => {
    it('should return player when found', async () => {
      const player = Player.create('player-1', 'John Doe');
      await repository.save(player);

      const result = await repository.findById('player-1');

      expect(result).toEqual(player);
    });

    it('should return null when player not found', async () => {
      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all players', async () => {
      const player1 = Player.create('player-1', 'John Doe');
      const player2 = Player.create('player-2', 'Jane Smith');

      await repository.save(player1);
      await repository.save(player2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(player1);
      expect(result).toContainEqual(player2);
    });

    it('should return empty array when no players exist', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete existing player', async () => {
      const player = Player.create('player-1', 'John Doe');
      await repository.save(player);

      await repository.delete('player-1');

      const result = await repository.findById('player-1');
      expect(result).toBeNull();
    });

    it('should not throw error when deleting non-existent player', async () => {
      await expect(repository.delete('non-existent')).resolves.toBeUndefined();
    });
  });

  describe('findByName', () => {
    it('should return player when found by name', async () => {
      const player = Player.create('player-1', 'John Doe');
      await repository.save(player);

      const result = await repository.findByName('John Doe');

      expect(result).toEqual(player);
    });

    it('should return null when player not found by name', async () => {
      const result = await repository.findByName('Non Existent');

      expect(result).toBeNull();
    });
  });

  describe('existsById', () => {
    it('should return true when player exists', async () => {
      const player = Player.create('player-1', 'John Doe');
      await repository.save(player);

      const result = await repository.existsById('player-1');

      expect(result).toBe(true);
    });

    it('should return false when player does not exist', async () => {
      const result = await repository.existsById('non-existent');

      expect(result).toBe(false);
    });
  });
});
