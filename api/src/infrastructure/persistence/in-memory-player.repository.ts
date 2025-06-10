import { Injectable } from '@nestjs/common';
import { Player } from '../../domain/entities/player.entity';
import { PlayerRepository } from '../../domain/repositories/player.repository';
import { PlayerId } from '../../shared/types/game.types';

@Injectable()
export class InMemoryPlayerRepository implements PlayerRepository {
  private players = new Map<PlayerId, Player>();

  async findById(id: PlayerId): Promise<Player | null> {
    const player = this.players.get(id);
    return player || null;
  }

  async findByName(name: string): Promise<Player | null> {
    for (const player of this.players.values()) {
      if (player.name === name) {
        return player;
      }
    }
    return null;
  }

  async save(player: Player): Promise<void> {
    this.players.set(player.id, player);
  }

  async delete(id: PlayerId): Promise<void> {
    this.players.delete(id);
  }

  async findAll(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async existsById(id: PlayerId): Promise<boolean> {
    return this.players.has(id);
  }

  // Test helper methods
  clear(): void {
    this.players.clear();
  }

  size(): number {
    return this.players.size;
  }
}
