import { PlayerId, PlayerName } from '../../shared/types/game.types';

export class CreatePlayerDto {
  constructor(public readonly name: PlayerName) {}
}

export class UpdatePlayerDto {
  constructor(
    public readonly playerId: PlayerId,
    public readonly name?: PlayerName,
  ) {}
}
