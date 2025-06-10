import { PlayerId } from '../../shared/types/game.types';
import { Player } from '../entities/player.entity';

export interface PlayerRepository {
  findById(id: PlayerId): Promise<Player | null>;
  findByName(name: string): Promise<Player | null>;
  save(player: Player): Promise<void>;
  delete(id: PlayerId): Promise<void>;
  findAll(): Promise<Player[]>;
  existsById(id: PlayerId): Promise<boolean>;
}
