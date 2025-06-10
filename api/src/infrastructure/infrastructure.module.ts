import { Module } from '@nestjs/common';
import { PersistenceModule } from './modules/persistence.module';
import { WebModule } from './modules/web.module';

@Module({
  imports: [PersistenceModule, WebModule],
  exports: [PersistenceModule, WebModule],
})
export class InfrastructureModule {}
