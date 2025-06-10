import {
    GameDifficulty,
    GridSize,
    PlayerId,
} from '../../shared/types/game.types';

export class CreateGameDto {
  constructor(
    public readonly creatorId: PlayerId,
    public readonly difficulty: GameDifficulty = 'easy',
    public readonly gridSize: GridSize = 5,
  ) {}
}

export class JoinGameDto {
  constructor(
    public readonly gameId: string,
    public readonly playerId: PlayerId,
  ) {}
}

export class LeaveGameDto {
  constructor(
    public readonly gameId: string,
    public readonly playerId: PlayerId,
  ) {}
}

export class PlaceItemDto {
  constructor(
    public readonly gameId: string,
    public readonly playerId: PlayerId,
    public readonly itemId: string,
    public readonly x: number,
    public readonly y: number,
  ) {}
}
