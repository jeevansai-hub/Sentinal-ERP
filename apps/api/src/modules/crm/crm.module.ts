import { Module } from '@nestjs/common';
import { CRMController } from './presentation/crm.controller';
import { CRMService } from './application/crm.service';

@Module({
  controllers: [CRMController],
  providers: [CRMService],
  exports: [CRMService],
})
export class CRMModule {}
