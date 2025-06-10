import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Post,
    Put
} from '@nestjs/common';
import { CreatePlayerDto, UpdatePlayerDto } from '../../application/dtos/player.dto';
import { PlayerUseCases } from '../../application/ports/player.port';
import { PLAYER_USE_CASES } from '../../application/application.module';
import { DomainException } from '../../shared/exceptions/domain.exceptions';
import { PlayerId } from '../../shared/types/game.types';

@Controller('players')
export class PlayerController {
  constructor(
    @Inject(PLAYER_USE_CASES) private readonly playerUseCases: PlayerUseCases
  ) {}

  @Post()
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    try {
      const player = await this.playerUseCases.createPlayer(createPlayerDto);
      return {
        success: true,
        data: player.toJSON(),
        message: 'Player created successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async getPlayer(@Param('id') id: PlayerId) {
    try {
      const player = await this.playerUseCases.getPlayer(id);
      if (!player) {
        throw new HttpException('Player not found', HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        data: player.toJSON()
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllPlayers() {
    try {
      const players = await this.playerUseCases.getAllPlayers();
      return {
        success: true,
        data: players.map(player => player.toJSON()),
        count: players.length
      };
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async updatePlayer(
    @Param('id') id: PlayerId,
    @Body() updatePlayerDto: Omit<UpdatePlayerDto, 'playerId'>
  ) {
    try {
      const dto = new UpdatePlayerDto(id, updatePlayerDto.name);
      const player = await this.playerUseCases.updatePlayer(dto);
      return {
        success: true,
        data: player.toJSON(),
        message: 'Player updated successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deletePlayer(@Param('id') id: PlayerId) {
    try {
      await this.playerUseCases.deletePlayer(id);
      return {
        success: true,
        message: 'Player deleted successfully'
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
