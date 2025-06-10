import { GameId, GameStatus, PlayerId } from '../../shared/types/game.types';
import { Game } from '../entities/game.entity';

export interface GameRepository {
  findById(id: GameId): Promise<Game | null>;
  findByCreator(creatorId: PlayerId): Promise<Game[]>;
  findByStatus(status: GameStatus): Promise<Game[]>;
  findActiveGamesForPlayer(playerId: PlayerId): Promise<Game[]>;
  save(game: Game): Promise<void>;
  delete(id: GameId): Promise<void>;
  findAll(): Promise<Game[]>;
  existsById(id: GameId): Promise<boolean>;
  findAvailableGames(): Promise<Game[]>; // Games in 'waiting' status with space for players
}
