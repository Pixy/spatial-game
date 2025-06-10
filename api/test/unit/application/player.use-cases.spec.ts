import { Test, TestingModule } from '@nestjs/testing';
import {
    CreatePlayerDto,
    UpdatePlayerDto,
} from '../../../src/application/dtos/player.dto';
import { PlayerUseCasesImpl } from '../../../src/application/use-cases/player.use-cases';
import { Player } from '../../../src/domain/entities/player.entity';
import { PlayerRepository } from '../../../src/domain/repositories/player.repository';
import { DomainException } from '../../../src/shared/exceptions/domain.exceptions';

describe('PlayerUseCasesImpl', () => {
  let playerUseCases: PlayerUseCasesImpl;
  let playerRepository: jest.Mocked<PlayerRepository>;

  beforeEach(async () => {
    const mockPlayerRepository = {
      findById: jest.fn(),
      findByName: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerUseCasesImpl,
        {
          provide: 'PLAYER_REPOSITORY',
          useValue: mockPlayerRepository,
        },
      ],
    }).compile();

    playerUseCases = module.get<PlayerUseCasesImpl>(PlayerUseCasesImpl);
    playerRepository = module.get('PLAYER_REPOSITORY');
  });

  describe('createPlayer', () => {
    it('should create a new player', async () => {
      const dto = new CreatePlayerDto('John Doe');
      playerRepository.findByName.mockResolvedValue(null);
      playerRepository.save.mockResolvedValue(undefined);

      const result = await playerUseCases.createPlayer(dto);

      expect(result.name).toBe('John Doe');
      expect(result.score).toBe(0);
      expect(playerRepository.findByName).toHaveBeenCalledWith('John Doe');
      expect(playerRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw error if player name already exists', async () => {
      const dto = new CreatePlayerDto('John Doe');
      const existingPlayer = Player.create('existing-id', 'John Doe');
      playerRepository.findByName.mockResolvedValue(existingPlayer);

      await expect(playerUseCases.createPlayer(dto)).rejects.toThrow(
        DomainException,
      );
    });
  });

  describe('updatePlayer', () => {
    it('should update existing player', async () => {
      const player = Player.create('player-1', 'John Doe');
      const dto = new UpdatePlayerDto('player-1', 'Jane Smith');

      playerRepository.findById.mockResolvedValue(player);
      playerRepository.findByName.mockResolvedValue(null);
      playerRepository.save.mockResolvedValue(undefined);

      const result = await playerUseCases.updatePlayer(dto);

      expect(result.name).toBe('Jane Smith');
      expect(playerRepository.save).toHaveBeenCalledWith(result);
    });

    it('should throw error if player not found', async () => {
      const dto = new UpdatePlayerDto('non-existent', 'Jane Smith');
      playerRepository.findById.mockResolvedValue(null);

      await expect(playerUseCases.updatePlayer(dto)).rejects.toThrow(
        DomainException,
      );
    });

    it('should throw error if new name is taken by another player', async () => {
      const player1 = Player.create('player-1', 'John Doe');
      const player2 = Player.create('player-2', 'Jane Smith');
      const dto = new UpdatePlayerDto('player-1', 'Jane Smith');

      playerRepository.findById.mockResolvedValue(player1);
      playerRepository.findByName.mockResolvedValue(player2);

      await expect(playerUseCases.updatePlayer(dto)).rejects.toThrow(
        DomainException,
      );
    });
  });

  describe('getPlayer', () => {
    it('should return player if found', async () => {
      const player = Player.create('player-1', 'John Doe');
      playerRepository.findById.mockResolvedValue(player);

      const result = await playerUseCases.getPlayer('player-1');

      expect(result).toBe(player);
    });

    it('should return null if player not found', async () => {
      playerRepository.findById.mockResolvedValue(null);

      const result = await playerUseCases.getPlayer('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('deletePlayer', () => {
    it('should delete existing player', async () => {
      const player = Player.create('player-1', 'John Doe');
      playerRepository.findById.mockResolvedValue(player);
      playerRepository.delete.mockResolvedValue(undefined);

      await playerUseCases.deletePlayer('player-1');

      expect(playerRepository.delete).toHaveBeenCalledWith('player-1');
    });

    it('should throw error if player not found', async () => {
      playerRepository.findById.mockResolvedValue(null);

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
      playerRepository.findAll.mockResolvedValue(players);

      const result = await playerUseCases.getAllPlayers();

      expect(result).toEqual(players);
    });
  });
});
