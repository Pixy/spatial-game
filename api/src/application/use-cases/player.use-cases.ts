import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../domain/entities/player.entity';
import { PlayerRepository } from '../../domain/repositories/player.repository';
import { PLAYER_REPOSITORY } from '../../infrastructure/modules/persistence.module';
import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { PlayerId } from '../../shared/types/game.types';
import { CreatePlayerDto, UpdatePlayerDto } from '../dtos/player.dto';
import { PlayerUseCases } from '../ports/player.port';

@Injectable()
export class PlayerUseCasesImpl implements PlayerUseCases {
  constructor(
    @Inject(PLAYER_REPOSITORY)
    private readonly playerRepository: PlayerRepository,
  ) {}

  async createPlayer(dto: CreatePlayerDto): Promise<Player> {
    // Check if player with same name already exists
    const existingPlayer = await this.playerRepository.findByName(dto.name);
    if (existingPlayer) {
      throw new DomainException('Player with this name already exists');
    }

    // Create new player
    const playerId = uuidv4();
    const player = Player.create(playerId, dto.name);

    // Save player
    await this.playerRepository.save(player);

    return player;
  }

  async updatePlayer(dto: UpdatePlayerDto): Promise<Player> {
    // Find existing player
    const player = await this.playerRepository.findById(dto.playerId);
    if (!player) {
      throw new DomainException('Player not found');
    }

    // Update fields if provided
    if (dto.name) {
      // Check if new name is already taken by another player
      const existingPlayer = await this.playerRepository.findByName(dto.name);
      if (existingPlayer && existingPlayer.id !== dto.playerId) {
        throw new DomainException('Player with this name already exists');
      }

      player.changeName(dto.name);
    }

    // Save updated player
    await this.playerRepository.save(player);

    return player;
  }

  async getPlayer(playerId: PlayerId): Promise<Player | null> {
    return await this.playerRepository.findById(playerId);
  }

  async deletePlayer(playerId: PlayerId): Promise<void> {
    // Verify player exists
    const player = await this.playerRepository.findById(playerId);
    if (!player) {
      throw new DomainException('Player not found');
    }

    await this.playerRepository.delete(playerId);
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerRepository.findAll();
  }
}
