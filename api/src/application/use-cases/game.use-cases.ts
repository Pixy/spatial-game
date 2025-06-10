import { Injectable, Inject } from '@nestjs/common';
import { Game } from '../../domain/entities/game.entity';
import { Player } from '../../domain/entities/player.entity';
import { GameRepository } from '../../domain/repositories/game.repository';
import { PlayerRepository } from '../../domain/repositories/player.repository';
import { GAME_REPOSITORY, PLAYER_REPOSITORY } from '../../infrastructure/modules/persistence.module';
import { GameDomainService } from '../../domain/services/game-domain.service';
import { ItemPosition } from '../../domain/value-objects/item-position.vo';
import { CreateGameDto, JoinGameDto, LeaveGameDto, PlaceItemDto } from '../dtos/game.dto';
import { GameUseCases } from '../ports/game.port';
import { GameId, PlayerId } from '../../shared/types/game.types';
import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameUseCasesImpl implements GameUseCases {
  constructor(
    @Inject(GAME_REPOSITORY) private readonly gameRepository: GameRepository,
    @Inject(PLAYER_REPOSITORY) private readonly playerRepository: PlayerRepository,
    private readonly gameDomainService: GameDomainService
  ) {}

  async createGame(dto: CreateGameDto): Promise<Game> {
    // Validate creator exists
    const creator = await this.playerRepository.findById(dto.creatorId);
    if (!creator) {
      throw new DomainException('Creator player not found');
    }

    // Create new game
    const gameId = uuidv4();
    const game = Game.create(gameId, dto.creatorId, dto.difficulty, dto.gridSize);
    
    // Add creator as first player
    game.addPlayer(creator);
    
    // Save game
    await this.gameRepository.save(game);
    
    return game;
  }

  async joinGame(dto: JoinGameDto): Promise<Game> {
    // Find game
    const game = await this.gameRepository.findById(dto.gameId);
    if (!game) {
      throw new DomainException('Game not found');
    }

    // Find player
    const player = await this.playerRepository.findById(dto.playerId);
    if (!player) {
      throw new DomainException('Player not found');
    }

    // Add player to game
    game.addPlayer(player);
    
    // Save updated game
    await this.gameRepository.save(game);
    
    return game;
  }

  async leaveGame(dto: LeaveGameDto): Promise<Game> {
    // Find game
    const game = await this.gameRepository.findById(dto.gameId);
    if (!game) {
      throw new DomainException('Game not found');
    }

    // Remove player from game
    game.removePlayer(dto.playerId);
    
    // Save updated game
    await this.gameRepository.save(game);
    
    return game;
  }

  async startGame(gameId: GameId): Promise<Game> {
    // Find game
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new DomainException('Game not found');
    }

    // Start the game
    game.startGame();
    
    // Save updated game
    await this.gameRepository.save(game);
    
    return game;
  }

  async placeItem(dto: PlaceItemDto): Promise<Game> {
    // Find game
    const game = await this.gameRepository.findById(dto.gameId);
    if (!game) {
      throw new DomainException('Game not found');
    }

    // Create position
    const position = ItemPosition.fromCoordinates(dto.x, dto.y);
    
    // Validate move using domain service
    if (!this.gameDomainService.canPlayerMakeMove(game, dto.playerId, position)) {
      throw new DomainException('Invalid move');
    }

    // Place item
    game.placeItem(dto.itemId, position, dto.playerId);
    
    // Check if game should end
    if (this.gameDomainService.shouldGameEnd(game)) {
      await this.endGame(dto.gameId);
    } else {
      // Save updated game
      await this.gameRepository.save(game);
    }
    
    return game;
  }

  async getGame(gameId: GameId): Promise<Game | null> {
    return await this.gameRepository.findById(gameId);
  }

  async getAvailableGames(): Promise<Game[]> {
    return await this.gameRepository.findAvailableGames();
  }

  async getPlayerGames(playerId: PlayerId): Promise<Game[]> {
    return await this.gameRepository.findActiveGamesForPlayer(playerId);
  }

  async endGame(gameId: GameId): Promise<Game> {
    // Find game
    const game = await this.gameRepository.findById(gameId);
    if (!game) {
      throw new DomainException('Game not found');
    }

    // Calculate final scores
    const animalPositions = new Map<string, ItemPosition>();
    game.itemPositions.forEach((position, itemId) => {
      animalPositions.set(itemId, position);
    });

    const totalHappiness = this.gameDomainService.calculateHappinessScore(game, animalPositions);
    
    // Update player scores based on happiness
    const players = Array.from(game.players.values());
    const scorePerPlayer = Math.floor(totalHappiness / players.length);
    
    players.forEach(player => {
      player.updateScore(scorePerPlayer);
    });

    // Save all updated players
    for (const player of players) {
      await this.playerRepository.save(player);
    }

    // Save final game state
    await this.gameRepository.save(game);
    
    return game;
  }
}
