import { HttpException, HttpStatus } from '@nestjs/common';

export class DomainException extends HttpException {
  constructor(message: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super(message, status);
  }
}

export class GameNotFoundException extends DomainException {
  constructor(gameId: string) {
    super(`Game with ID ${gameId} not found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidGameStateException extends DomainException {
  constructor(reason: string) {
    super(`Invalid game state: ${reason}`, HttpStatus.CONFLICT);
  }
}

export class InvalidMoveException extends DomainException {
  constructor(reason: string) {
    super(`Invalid move: ${reason}`, HttpStatus.BAD_REQUEST);
  }
}

export class GameAlreadyCompletedException extends DomainException {
  constructor(gameId: string) {
    super(`Game ${gameId} is already completed`, HttpStatus.CONFLICT);
  }
}

export class PlayerNotFoundException extends DomainException {
  constructor(playerId: string) {
    super(`Player with ID ${playerId} not found`, HttpStatus.NOT_FOUND);
  }
}
