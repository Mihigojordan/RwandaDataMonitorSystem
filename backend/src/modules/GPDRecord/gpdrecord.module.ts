import { Module } from '@nestjs/common';
import { GPDRecordService } from './gpdrecord.service';
import { GPDRecordController } from './gpdrecord.controller';
import { PrismaModule } from '../../../src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [GPDRecordController],
  providers: [GPDRecordService],
})
export class GPDRecordModule {}
