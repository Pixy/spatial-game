import { Injectable } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { GameRepository } from '../../domain/repositories/game.repository';
import { GameId, GameStatus, PlayerId } from '../../shared/types/game.types';

@Injectable()
export class InMemoryGameRepository implements GameRepository {
  private games = new Map<GameId, Game>();

  async findById(id: GameId): Promise<Game | null> {
    const game = this.games.get(id);
    return game || null;
  }

  async findByCreator(creatorId: PlayerId): Promise<Game[]> {
    const games: Game[] = [];
    for (const game of this.games.values()) {
      if (game.createdBy === creatorId) {
        games.push(game);
      }
    }
    return games;
  }

  async findByStatus(status: GameStatus): Promise<Game[]> {
    const games: Game[] = [];
    for (const game of this.games.values()) {
      if (game.status === status) {
        games.push(game);
      }
    }
    return games;
  }

  async findActiveGamesForPlayer(playerId: PlayerId): Promise<Game[]> {
    const games: Game[] = [];
    for (const game of this.games.values()) {
      if (
        game.players.has(playerId) &&
        (game.status === 'active' || game.status === 'waiting')
      ) {
        games.push(game);
      }
    }
    return games;
  }

  async save(game: Game): Promise<void> {
    this.games.set(game.id, game);
  }

  async delete(id: GameId): Promise<void> {
    this.games.delete(id);
  }

  async findAll(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async existsById(id: GameId): Promise<boolean> {
    return this.games.has(id);
  }

  async findAvailableGames(): Promise<Game[]> {
    const games: Game[] = [];
    for (const game of this.games.values()) {
      if (game.status === 'waiting' && game.players.size < 4) {
        games.push(game);
      }
    }
    return games;
  }

  // Test helper methods
  clear(): void {
    this.games.clear();
  }

  size(): number {
    return this.games.size;
  }
}
