import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { GameController, PlayerController } from '../web';

@Module({
  imports: [ApplicationModule],
  controllers: [PlayerController, GameController],
})
export class WebModule {}
