import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Query
} from '@nestjs/common';
import { CreateGameDto, JoinGameDto, LeaveGameDto, PlaceItemDto } from '../../application/dtos/game.dto';
import { GameUseCases } from '../../application/ports/game.port';
import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { GameId, PlayerId } from '../../shared/types/game.types';

@Controller('games')
export class GameController {
  constructor(private readonly gameUseCases: GameUseCases) {}

  @Post()
  async createGame(@Body() createGameDto: CreateGameDto) {
    try {
      const game = await this.gameUseCases.createGame(createGameDto);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Game created successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getGame(@Param('id') id: GameId) {
    try {
      const game = await this.gameUseCases.getGame(id);
      if (!game) {
        throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: game.toJSON()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getGames(@Query('playerId') playerId?: PlayerId) {
    try {
      let games;
      if (playerId) {
        games = await this.gameUseCases.getPlayerGames(playerId);
      } else {
        games = await this.gameUseCases.getAvailableGames();
      }
      
      return {
        success: true,
        data: games.map(game => game.toJSON()),
        count: games.length
      };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/join')
  async joinGame(
    @Param('id') gameId: GameId,
    @Body() body: { playerId: PlayerId }
  ) {
    try {
      const joinGameDto = new JoinGameDto(gameId, body.playerId);
      const game = await this.gameUseCases.joinGame(joinGameDto);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Successfully joined game'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/leave')
  async leaveGame(
    @Param('id') gameId: GameId,
    @Body() body: { playerId: PlayerId }
  ) {
    try {
      const leaveGameDto = new LeaveGameDto(gameId, body.playerId);
      const game = await this.gameUseCases.leaveGame(leaveGameDto);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Successfully left game'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/start')
  async startGame(@Param('id') gameId: GameId) {
    try {
      const game = await this.gameUseCases.startGame(gameId);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Game started successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/place-item')
  async placeItem(
    @Param('id') gameId: GameId,
    @Body() body: { playerId: PlayerId; itemId: string; x: number; y: number }
  ) {
    try {
      const placeItemDto = new PlaceItemDto(
        gameId,
        body.playerId,
        body.itemId,
        body.x,
        body.y
      );
      const game = await this.gameUseCases.placeItem(placeItemDto);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Item placed successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/end')
  async endGame(@Param('id') gameId: GameId) {
    try {
      const game = await this.gameUseCases.endGame(gameId);
      return {
        success: true,
        data: game.toJSON(),
        message: 'Game ended successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
