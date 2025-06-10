import { Module } from '@nestjs/common';
import { GameDomainService } from '../domain/services/game-domain.service';
import { PersistenceModule } from '../infrastructure/modules/persistence.module';
import { GameUseCasesImpl, PlayerUseCasesImpl } from './use-cases';

// Tokens d'injection
export const GAME_USE_CASES = 'GAME_USE_CASES';
export const PLAYER_USE_CASES = 'PLAYER_USE_CASES';

@Module({
  imports: [PersistenceModule],
  providers: [
    GameDomainService,
    {
      provide: GAME_USE_CASES,
      useClass: GameUseCasesImpl,
    },
    {
      provide: PLAYER_USE_CASES,
      useClass: PlayerUseCasesImpl,
    },
  ],
  exports: [GAME_USE_CASES, PLAYER_USE_CASES, GameDomainService],
})
export class ApplicationModule {}
