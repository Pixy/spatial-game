import { v4 as uuidv4 } from 'uuid';
import {
    CreatePlayerDto,
    UpdatePlayerDto,
} from '../../../application/dtos/player.dto';
import { PlayerUseCasesImpl } from '../../../application/use-cases/player.use-cases';
import { Player } from '../../../domain/entities/player.entity';
import { PlayerRepository } from '../../../domain/repositories/player.repository';
import { DomainException } from '../../../shared/exceptions/domain.exceptions';

jest.mock('uuid');

describe('PlayerUseCases', () => {
  let playerUseCases: PlayerUseCasesImpl;
  let mockPlayerRepository: jest.Mocked<PlayerRepository>;

  beforeEach(() => {
    mockPlayerRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
      existsById: jest.fn(),
    };

    playerUseCases = new PlayerUseCasesImpl(mockPlayerRepository);
  });

  describe('createPlayer', () => {
    it('should create a new player successfully', async () => {
      const createDto = new CreatePlayerDto('John Doe');

      mockPlayerRepository.findByName.mockResolvedValue(null);
      mockPlayerRepository.save.mockResolvedValue(undefined);
      (uuidv4 as jest.Mock).mockReturnValue('generated-uuid');

      const result = await playerUseCases.createPlayer(createDto);

      expect(result.name).toBe('John Doe');
      expect(result.score).toBe(0);
      expect(result.isActive).toBe(true);
      expect(mockPlayerRepository.save).toHaveBeenCalled();
    });

    it('should throw error when player name already exists', async () => {
      const createDto = new CreatePlayerDto('John Doe');
      const existingPlayer = Player.create('existing-id', 'John Doe');

      mockPlayerRepository.findByName.mockResolvedValue(existingPlayer);

      await expect(playerUseCases.createPlayer(createDto)).rejects.toThrow(
        DomainException,
      );
    });
  });

  describe('updatePlayer', () => {
    it('should update a player successfully', async () => {
      const updateDto = new UpdatePlayerDto('player-1', 'John Smith');
      const existingPlayer = Player.create('player-1', 'John Doe');

      mockPlayerRepository.findById.mockResolvedValue(existingPlayer);
      mockPlayerRepository.findByName.mockResolvedValue(null);
      mockPlayerRepository.save.mockResolvedValue(undefined);

      const result = await playerUseCases.updatePlayer(updateDto);

      expect(result.name).toBe('John Smith');
      expect(mockPlayerRepository.save).toHaveBeenCalledWith(existingPlayer);
    });

    it('should throw error when player not found', async () => {
      const updateDto = new UpdatePlayerDto('player-1', 'John Smith');

      mockPlayerRepository.findById.mockResolvedValue(null);

      await expect(playerUseCases.updatePlayer(updateDto)).rejects.toThrow(
        DomainException,
      );
    });
  });

  describe('getPlayer', () => {
    it('should return player when found', async () => {
      const player = Player.create('player-1', 'John Doe');
      mockPlayerRepository.findById.mockResolvedValue(player);

      const result = await playerUseCases.getPlayer('player-1');

      expect(result).toEqual(player);
    });

    it('should return null when player not found', async () => {
      mockPlayerRepository.findById.mockResolvedValue(null);

      const result = await playerUseCases.getPlayer('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('deletePlayer', () => {
    it('should delete player successfully', async () => {
      const existingPlayer = Player.create('player-1', 'John Doe');

      mockPlayerRepository.findById.mockResolvedValue(existingPlayer);
      mockPlayerRepository.delete.mockResolvedValue(undefined);

      await playerUseCases.deletePlayer('player-1');

      expect(mockPlayerRepository.delete).toHaveBeenCalledWith('player-1');
    });

    it('should throw error when player not found', async () => {
      mockPlayerRepository.findById.mockResolvedValue(null);

      await expect(playerUseCases.deletePlayer('non-existent')).rejects.toThrow(
        DomainException,
      );
    });
  });

  describe('getAllPlayers', () => {
    it('should return all players', async () => {
      const players = [
        Player.create('player-1', 'John Doe'),
        Player.create('player-2', 'Jane Smith'),
      ];
      mockPlayerRepository.findAll.mockResolvedValue(players);

      const result = await playerUseCases.getAllPlayers();

      expect(result).toEqual(players);
    });

    it('should return empty array when no players exist', async () => {
      mockPlayerRepository.findAll.mockResolvedValue([]);

      const result = await playerUseCases.getAllPlayers();

      expect(result).toEqual([]);
    });
  });
});
