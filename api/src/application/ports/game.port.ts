import { Game } from '../../domain/entities/game.entity';
import { GameId, PlayerId } from '../../shared/types/game.types';
import {
    CreateGameDto,
    JoinGameDto,
    LeaveGameDto,
    PlaceItemDto,
} from '../dtos/game.dto';

export interface GameUseCases {
  createGame(dto: CreateGameDto): Promise<Game>;
  joinGame(dto: JoinGameDto): Promise<Game>;
  leaveGame(dto: LeaveGameDto): Promise<Game>;
  startGame(gameId: GameId): Promise<Game>;
  placeItem(dto: PlaceItemDto): Promise<Game>;
  getGame(gameId: GameId): Promise<Game | null>;
  getAvailableGames(): Promise<Game[]>;
  getPlayerGames(playerId: PlayerId): Promise<Game[]>;
  endGame(gameId: GameId): Promise<Game>;
}
