import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [ApplicationModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
