import { Player } from '../../domain/entities/player.entity';
import { PlayerId } from '../../shared/types/game.types';
import { CreatePlayerDto, UpdatePlayerDto } from '../dtos/player.dto';

export interface PlayerUseCases {
  createPlayer(dto: CreatePlayerDto): Promise<Player>;
  updatePlayer(dto: UpdatePlayerDto): Promise<Player>;
  getPlayer(playerId: PlayerId): Promise<Player | null>;
  deletePlayer(playerId: PlayerId): Promise<void>;
  getAllPlayers(): Promise<Player[]>;
}
