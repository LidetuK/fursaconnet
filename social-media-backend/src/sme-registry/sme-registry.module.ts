import { Module } from '@nestjs/common';
import { SMERegistryController } from './sme-registry.controller';
import { SMERegistryService } from './sme-registry.service';

@Module({
  controllers: [SMERegistryController],
  providers: [SMERegistryService],
  exports: [SMERegistryService],
})
export class SMERegistryModule {}
