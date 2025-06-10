import { Module } from '@nestjs/common';
import {
    InMemoryGameRepository,
    InMemoryPlayerRepository,
} from '../persistence';

// Tokens d'injection pour les repositories
export const PLAYER_REPOSITORY = 'PLAYER_REPOSITORY';
export const GAME_REPOSITORY = 'GAME_REPOSITORY';

@Module({
  providers: [
    {
      provide: PLAYER_REPOSITORY,
      useClass: InMemoryPlayerRepository,
    },
    {
      provide: GAME_REPOSITORY,
      useClass: InMemoryGameRepository,
    },
  ],
  exports: [PLAYER_REPOSITORY, GAME_REPOSITORY],
})
export class PersistenceModule {}
